import string
import secrets

ALPHABET = string.ascii_letters + string.digits  # 62 characters


def generate_alias(length=6) -> str:
    return "".join(secrets.choice(ALPHABET) for _ in range(length))
