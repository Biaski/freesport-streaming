import json
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Proxy for Goodgame player to bypass iframe restrictions
    Args: event - dict with httpMethod and queryStringParameters
          context - object with request_id attribute
    Returns: HTTP response with HTML player
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        channel = params.get('channel', '')
        
        if not channel:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Channel parameter required'}),
                'isBase64Encoded': False
            }
        
        html = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        html, body {{ width: 100%; height: 100%; overflow: hidden; background: #000; }}
        #player {{ width: 100%; height: 100%; }}
        #_video {{ width: 100% !important; height: 100% !important; }}
    </style>
    <script src="https://goodgame.ru/js/minified/ggplayer.js"></script>
</head>
<body>
    <div id="player"></div>
    <script>
        new GGPlayer({{
            container: document.getElementById('player'),
            playlist: 'https://hls.goodgame.ru/dash/{channel}/index.mpd',
            poster: 'https://hls.goodgame.ru/previews/{channel}.jpg',
            autoplay: true,
            quality: "source",
            streamkey: '{channel}',
            candy: 1
        }});
    </script>
</body>
</html>'''
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            },
            'body': html,
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
