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
        
        # Test 1: List projects
        print("\n1. Testing list projects:")
        list_projects_request = send_mcp_request("tools/call", {
            "name": "doppler_list_projects",
            "arguments": {}
        })
        process.stdin.write(list_projects_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        print("Response:", response)
        
        # Test 2: List configs for 'dev' project
        print("\n2. Testing list configs for 'dev' project:")
        list_configs_request = send_mcp_request("tools/call", {
            "name": "doppler_list_configs",
            "arguments": {"project": "dev"}
        })
        process.stdin.write(list_configs_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        print("Response:", response)
        
        # Test 3: List secret names
        print("\n3. Testing list secret names in dev/dev_personal:")
        list_secrets_request = send_mcp_request("tools/call", {
            "name": "doppler_list_secret_names",
            "arguments": {"project": "dev", "config": "dev_personal"}
        })
        process.stdin.write(list_secrets_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        print("Response:", response)
        
        # Test 4: Get activity logs
        print("\n4. Testing get activity logs:")
        logs_request = send_mcp_request("tools/call", {
            "name": "doppler_activity_logs",
            "arguments": {}
        })
        process.stdin.write(logs_request + '\n')
        process.stdin.flush()
        response = process.stdout.readline()
        print("Response:", response)
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_doppler_mcp()