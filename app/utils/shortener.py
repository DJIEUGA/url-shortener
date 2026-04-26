import string
import secrets

ALPHABET = string.ascii_letters + string.digits  # 62 characters

def encode(length=5) -> str:
    """Encodes a numeric ID to a base62 string."""
    code = ""
    for _ in range(length):
        code += secrets.choice(ALPHABET)
    return code


def decode(s: str) -> int:
    """ Decodes a base62 string to its numeric ID. """
    base = len(ALPHABET)
    num = 0
    for char in s:
        num = num * base + ALPHABET.index(char)
    return num

