
import os
from sqlalchemy.engine import URL


class Config:

    DB_HOST = os.getenv("DB_HOST", "localhost")

    SQLALCHEMY_DATABASE_URI = URL.create(
        drivername="mysql+pymysql",
        username=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        host=DB_HOST,
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME", "db_productos")
    )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = (
        {
            "connect_args": {
                "ssl": {
                    "ca": os.path.abspath(
                        os.path.join(
                            os.path.dirname(__file__), "..", "..", "ca.pem"
                        )
                    )
                }
            }
        }
        if DB_HOST != "localhost"
        else {}
    )
