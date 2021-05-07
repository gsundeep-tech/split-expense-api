import os
from split_expenses_api.api.app import create_app

use_debugger = os.environ.get("DEBUG", False)
host = os.environ.get("HOST", "0.0.0.0")
port = os.environ.get("PORT", "5000")

app = create_app()

if __name__ == "__main__":
    app.run(use_debugger=use_debugger,
            use_reloader=True,
            host=host,
            port=port)
