"""Expand terse concept seeds into multi-paragraph layman HTML."""

from __future__ import annotations

import re

# Warm opener per category — sets context without selling anything.
GROUP_INTROS: dict[str, str] = {
    "money-fundamentals": (
        "Before we talk about where to invest, it helps to understand how money itself works. "
        "These ideas show up everywhere — salary, rent, UPI, bank statements."
    ),
    "saving": (
        "Saving is not glamorous, but almost every financial plan starts here. "
        "These are habits and ideas, not products someone is trying to sell you."
    ),
    "investing-basics": (
        "Investing sounds intimidating because people use big words. "
        "Strip those away and the ideas are quite practical."
    ),
    "mutual-funds": (
        "Mutual funds are how most salaried Indians first enter investing. "
        "Here is what the terms on the app screen actually mean."
    ),
    "government-schemes": (
        "India has several government-backed savings schemes. "
        "They are boring but useful — worth understanding in plain language."
    ),
    "fixed-income": (
        "Fixed income means you lend money and get predictable interest back. "
        "Safer than stocks, but not risk-free — here is the honest picture."
    ),
    "stocks": (
        "Owning a stock means owning a tiny piece of a company. "
        "The headlines make it sound like gambling; the reality is more nuanced."
    ),
    "gold": (
        "Gold has a special place in Indian households. "
        "Let us separate tradition, emotion, and actual financial role."
    ),
    "real-estate": (
        "Property feels safe because you can touch it. "
        "That does not automatically make it the best use of your money."
    ),
    "tax-basics": (
        "Taxes are confusing because the rules change and the forms use jargon. "
        "These concepts explain the ideas behind the numbers."
    ),
    "insurance": (
        "Insurance is protection, not investment — despite what agents may tell you. "
        "Understanding the difference saves a lot of money and regret."
    ),
    "retirement-planning": (
        "Retirement feels far away until suddenly it is not. "
        "These ideas help you think about it without panic."
    ),
    "behavioural-finance": (
        "Your brain is not wired for long-term investing. "
        "Knowing your biases helps you avoid expensive mistakes."
    ),
    "advanced-investing": (
        "These topics go beyond basics. "
        "Read them when your foundation is solid — skip them if you are just starting."
    ),
    "financial-planning": (
        "A financial plan is just a clear picture of where you are and where you want to go. "
        "No fancy software required to understand these building blocks."
    ),
}


def layman(*paragraphs: str) -> str:
    """Wrap plain-text paragraphs in HTML <p> tags for RichTextContent."""
    return "".join(f"<p>{p.strip()}</p>" for p in paragraphs if p and p.strip())


def _sentences(text: str) -> list[str]:
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p.strip() for p in parts if p.strip()]


def expand_concept(title: str, tagline: str, brief: str, group_slug: str) -> str:
    """
    Turn a 1–2 sentence seed into a friendly multi-paragraph explanation.
    Keeps the original facts; adds context, plain language, and a soft takeaway.
    """
    intro = GROUP_INTROS.get(
        group_slug,
        "Here is a plain-English explanation. If a word sounds technical, we unpack it as we go.",
    )

    sentences = _sentences(brief)
    if len(sentences) >= 2:
        core = (
            f"{sentences[0]} {sentences[1]}"
            if not sentences[0].endswith((".", "!", "?"))
            else f"{sentences[0]} {sentences[1]}"
        )
        extra = " ".join(sentences[2:]) if len(sentences) > 2 else ""
    elif sentences:
        core = sentences[0]
        extra = ""
    else:
        core = brief.strip()
        extra = ""

    plain = (
        f"Put simply — {tagline.rstrip('.').lower()}. "
        "You do not need to memorise a textbook definition. "
        "Just recognise the idea when it shows up in a conversation, a news headline, or a bank form."
    )

    if extra:
        detail = f"{core} {extra}"
    else:
        detail = core

    takeaway = (
        f"The main thing to remember about <strong>{title.lower()}</strong> is simple — "
        f"{tagline.rstrip('.').lower()}. "
        "Understanding beats memorising every time."
    )

    return layman(intro, detail, plain, takeaway)
