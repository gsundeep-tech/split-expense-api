from split_expenses_api.api.app import create_app

app = create_app()

if __name__ == "__main__":
    app.run(use_debugger=True,
            use_reloader=True,
            host="0.0.0.0",
            port="5000")
