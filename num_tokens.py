import tiktoken

def count_tokens(text: str, model: str = "gpt-3.5-turbo") -> int:
    """
    Count the number of OpenAI tokens in a string of text.
    
    Args:
        text (str): The text to count tokens for
        model (str): The OpenAI model to use for token counting (default: "gpt-3.5-turbo")
    
    Returns:
        int: Number of tokens in the text
    """
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        # If model is not found, use cl100k_base encoding (used by gpt-3.5-turbo and gpt-4)
        encoding = tiktoken.get_encoding("cl100k_base")
    
    tokens = encoding.encode(text)
    return len(tokens)

if __name__ == "__main__":
    # Example usage
    from pathlib import Path
    sample_text = Path("scratch.space").read_text()
    token_count = count_tokens(sample_text)
    print(f"Token count: {token_count}")