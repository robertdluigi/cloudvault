import subprocess
import sys

def run_command(command):
    """Run a shell command and handle errors."""
    try:
        result = subprocess.run(command, check=True, text=True, shell=True)
        return result.returncode
    except subprocess.CalledProcessError as e:
        print(f"Error: Command '{command}' failed with return code {e.returncode}")
        sys.exit(e.returncode)

def main():
    if len(sys.argv) < 3:
        print("Usage: python git_push.py <add-option> \"Your commit message here\"")
        print("Example: python git_push.py . \"Initial commit\"")
        sys.exit(1)

    add_option = sys.argv[1]  # e.g., ".", specific file, or folder
    commit_message = sys.argv[2]  # Commit message

    print("Staging changes...")
    run_command(f"git add {add_option}")

    print("Committing changes...")
    run_command(f'git commit -m "{commit_message}"')

    print("Pushing to the 'main' branch...")
    run_command("git push -u origin main")

    print("Changes pushed to origin/main successfully!")

if __name__ == "__main__":
    main()
