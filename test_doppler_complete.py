#!/usr/bin/env python3
import json
import subprocess
import sys
import os

def send_mcp_request(method, params=None):
    """Send a JSON-RPC request to the MCP server via stdin/stdout"""
    request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or {}
    }
    return json.dumps(request)

def test_doppler_mcp():
    # Set up environment
    env = os.environ.copy()
    env['DOPPLER_TOKEN'] = os.getenv('DOPPLER_TOKEN', 'your-token-here')
    
    # Start the MCP server
    process = subprocess.Popen(
        ['node', 'dist/index.js'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        env=env
    )
    
    try:
        # Initialize the connection
        init_request = send_mcp_request("initialize", {
            "protocolVersion": "0.1.0",
            "capabilities": {},
            "clientInfo": {
                "name": "test-client",
                "version": "1.0.0"
            }
        })
        
        process.stdin.write(init_request + '\n')
        process.stdin.flush()
        
        # Read initialization response
        response = process.stdout.readline()
        print("Initialize response:", response)
        
        # Test 1: List all projects
        print("\n=== TEST 1: List all projects ===")
        list_projects_request = send_mcp_request("tools/call", {
            "name": "doppler_list_projects",
            "arguments": {}
        })
        process.stdin.write(list_projects_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        result = json.loads(response)
        if "result" in result and "content" in result["result"]:
            content = json.loads(result["result"]["content"][0]["text"])
            print(f"Found {len(content)} projects:")
            for proj in content:
                print(f"  - {proj['name']}: {proj['description'] or 'No description'}")
        
        # Test 2: List secrets for 'dev' project (using doppler_list_secrets)
        print("\n=== TEST 2: List secrets in dev/dev_personal ===")
        list_secrets_request = send_mcp_request("tools/call", {
            "name": "doppler_list_secrets",
            "arguments": {"project": "dev", "config": "dev_personal"}
        })
        process.stdin.write(list_secrets_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        result = json.loads(response)
        if "result" in result and "content" in result["result"]:
            secrets = json.loads(result["result"]["content"][0]["text"])
            print(f"Found {len(secrets)} secrets:")
            for name in secrets:
                print(f"  - {name}")
        
        # Test 3: Get a specific secret value
        print("\n=== TEST 3: Get specific secret value (if exists) ===")
        # Get LINEAR_APP_KAYAOZKUR secret
        secret_name = "LINEAR_APP_KAYAOZKUR"
        get_secret_request = send_mcp_request("tools/call", {
            "name": "doppler_get_secret",
            "arguments": {"project": "dev", "config": "dev_personal", "name": secret_name}
        })
        process.stdin.write(get_secret_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        result = json.loads(response)
        if "result" in result and "content" in result["result"]:
            secret_value = result["result"]["content"][0]["text"]
            print(f"Secret '{secret_name}' value retrieved successfully")
            print(f"Value length: {len(secret_value)} characters")
        
        # Test 4: Get activity logs
        print("\n=== TEST 4: Get activity logs ===")
        logs_request = send_mcp_request("tools/call", {
            "name": "doppler_get_activity_logs",
            "arguments": {}
        })
        process.stdin.write(logs_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        result = json.loads(response)
        if "result" in result and "content" in result["result"]:
            logs = json.loads(result["result"]["content"][0]["text"])
            print(f"Found {len(logs)} activity log entries")
            if logs:
                print("Most recent activity:")
                for log in logs[:5]:  # Show first 5
                    print(f"  - {log.get('created_at', 'Unknown time')}: {log.get('action', 'Unknown action')}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_doppler_mcp()