'''
Business: API для управления трансляциями, расписанием и новостями Freesport
Args: event - dict с httpMethod, body, queryStringParameters, pathParams
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict с statusCode, headers, body
'''

import json
import os
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    resource = query_params.get('resource', 'stream')
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        if resource == 'stream':
            if method == 'GET':
                cur.execute('SELECT * FROM streams WHERE is_live = true ORDER BY updated_at DESC LIMIT 1')
                stream = cur.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'stream': dict(stream) if stream else None}, default=str),
                    'isBase64Encoded': False
                }
            
            elif method == 'PUT':
                body_data = json.loads(event.get('body', '{}'))
                stream_url = body_data.get('url', '')
                title = body_data.get('title', 'Прямая трансляция')
                sport = body_data.get('sport', '')
                is_live = body_data.get('is_live', True)
                
                cur.execute('''
                    UPDATE streams SET is_live = false WHERE is_live = true
                ''')
                
                cur.execute('''
                    INSERT INTO streams (title, url, is_live, sport, updated_at) 
                    VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                    RETURNING *
                ''', (title, stream_url, is_live, sport))
                
                new_stream = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'stream': dict(new_stream)}, default=str),
                    'isBase64Encoded': False
                }
        
        elif resource == 'schedule':
            if method == 'GET':
                cur.execute('''
                    SELECT * FROM schedule_events 
                    ORDER BY event_date ASC, event_time ASC
                ''')
                events = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'events': [dict(e) for e in events]}, default=str),
                    'isBase64Encoded': False
                }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                cur.execute('''
                    INSERT INTO schedule_events 
                    (title, event_date, event_time, sport, description, stream_url)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING *
                ''', (
                    body_data.get('title'),
                    body_data.get('event_date'),
                    body_data.get('event_time'),
                    body_data.get('sport'),
                    body_data.get('description', ''),
                    body_data.get('stream_url', '')
                ))
                
                new_event = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'event': dict(new_event)}, default=str),
                    'isBase64Encoded': False
                }
            
            elif method == 'DELETE':
                event_id = query_params.get('id')
                if event_id:
                    cur.execute('DELETE FROM schedule_events WHERE id = %s', (event_id,))
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
        
        elif resource == 'news':
            if method == 'GET':
                cur.execute('''
                    SELECT * FROM news_posts 
                    ORDER BY published_at DESC
                ''')
                news = cur.fetchall()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'news': [dict(n) for n in news]}, default=str),
                    'isBase64Encoded': False
                }
            
            elif method == 'POST':
                body_data = json.loads(event.get('body', '{}'))
                
                cur.execute('''
                    INSERT INTO news_posts (title, content, image_url)
                    VALUES (%s, %s, %s)
                    RETURNING *
                ''', (
                    body_data.get('title'),
                    body_data.get('content'),
                    body_data.get('image_url', '')
                ))
                
                new_post = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'post': dict(new_post)}, default=str),
                    'isBase64Encoded': False
                }
            
            elif method == 'DELETE':
                post_id = query_params.get('id')
                if post_id:
                    cur.execute('DELETE FROM news_posts WHERE id = %s', (post_id,))
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'success': True}),
                        'isBase64Encoded': False
                    }
        
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Resource not found'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()