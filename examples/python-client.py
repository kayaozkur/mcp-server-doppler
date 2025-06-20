#!/usr/bin/env python3
"""
Python Client Example for MCP Doppler Server

This example demonstrates how to use the MCP Doppler Server
from Python applications.
"""

# Note: This is example code showing how the client would work
# The actual mcp_doppler_client module would need to be installed

from mcp_doppler_client import MCPDopplerClient, MCPError

def main():
    """Example usage of MCP Doppler Client"""
    
    try:
        # Initialize the client (uses DOPPLER_TOKEN from environment)
        with MCPDopplerClient() as client:
            
            # 1. List all projects
            print("=== Listing Projects ===")
            projects = client.list_projects()
            for project in projects:
                print(f"- {project['slug']}: {project['name']}")
            
            if not projects:
                print("No projects found. Create one in Doppler first.")
                return
            
            # Use the first project for examples
            project_slug = projects[0]['slug']
            config = 'development'
            
            # 2. List secrets in a project/config
            print(f"\n=== Secrets in {project_slug}/{config} ===")
            try:
                secrets = client.list_secrets(project_slug, config)
                for secret_name in secrets[:5]:  # Show first 5
                    print(f"- {secret_name}")
                if len(secrets) > 5:
                    print(f"... and {len(secrets) - 5} more")
            except MCPError as e:
                print(f"Could not list secrets: {e}")
            
            # 3. Set a new secret
            print(f"\n=== Setting a Test Secret ===")
            test_key = "EXAMPLE_MCP_TEST"
            test_value = "test-value-12345"
            
            try:
                client.set_secret(project_slug, config, test_key, test_value)
                print(f"✓ Successfully set {test_key}")
            except MCPError as e:
                print(f"Could not set secret: {e}")
            
            # 4. Get the secret back
            print(f"\n=== Retrieving Secret ===")
            try:
                secret_data = client.get_secret(project_slug, config, test_key)
                print(f"Retrieved {test_key}: {secret_data}")
            except MCPError as e:
                print(f"Could not get secret: {e}")
            
            # 5. Delete the test secret
            print(f"\n=== Cleaning Up ===")
            try:
                client.delete_secrets(project_slug, config, [test_key])
                print(f"✓ Successfully deleted {test_key}")
            except MCPError as e:
                print(f"Could not delete secret: {e}")
            
            # 6. Create a service token (be careful!)
            print(f"\n=== Service Token Example ===")
            print("Note: Creating service tokens should be done carefully")
            print("Example code:")
            print(f"""
token_data = client.create_service_token(
    project='{project_slug}',
    config='{config}',
    name='example-token',
    access='read'  # read-only for safety
)
print(f"Token created: {{token_data['key'][:20]}}...")
""")
            
            # 7. View activity logs
            print(f"\n=== Recent Activity ===")
            try:
                logs = client.get_activity_logs(project_slug, page=1, per_page=3)
                for log in logs:
                    print(f"- {log.get('created_at', 'N/A')}: {log.get('text', 'N/A')}")
            except MCPError as e:
                print(f"Could not get logs: {e}")
    
    except MCPError as e:
        print(f"MCP Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")


def example_error_handling():
    """Example of proper error handling"""
    print("\n=== Error Handling Example ===")
    
    try:
        with MCPDopplerClient() as client:
            # This will fail - non-existent project
            client.list_secrets("non-existent-project", "config")
    except MCPError as e:
        print(f"Handled MCP error gracefully: {e}")


def example_bulk_operations():
    """Example of bulk secret operations"""
    print("\n=== Bulk Operations Example ===")
    
    # Example of setting multiple secrets
    secrets_to_set = {
        "DATABASE_URL": "postgresql://localhost:5432/myapp",
        "REDIS_URL": "redis://localhost:6379",
        "API_KEY": "sk-example-12345",
        "DEBUG": "true"
    }
    
    print("Example code for bulk operations:")
    print("""
# Using the convenience function
from mcp_doppler_client import set_secrets_bulk

count = set_secrets_bulk('myapp', 'development', secrets_to_set)
print(f"Successfully set {count} secrets")

# Or manually with the client
with MCPDopplerClient() as client:
    for name, value in secrets_to_set.items():
        client.set_secret('myapp', 'development', name, value)
""")


if __name__ == "__main__":
    print("MCP Doppler Client Example")
    print("=" * 50)
    
    # Check for token
    import os
    if not os.environ.get('DOPPLER_TOKEN'):
        print("Error: DOPPLER_TOKEN not set")
        print("Please set: export DOPPLER_TOKEN=your_token_here")
        exit(1)
    
    main()
    example_error_handling()
    example_bulk_operations()