def calculate_sip(monthly: float, rate_percent: float, years: int) -> dict:
    r = rate_percent / 100 / 12
    n = years * 12

    if r == 0:
        total_value = monthly * n
    else:
        total_value = monthly * ((((1 + r) ** n) - 1) / r) * (1 + r)

    total_invested = monthly * n
    total_gain = total_value - total_invested
    multiplier = total_value / total_invested if total_invested > 0 else 0

    yearly = []
    for y in range(1, years + 1):
        n_y = y * 12
        if r == 0:
            val = monthly * n_y
        else:
            val = monthly * ((((1 + r) ** n_y) - 1) / r) * (1 + r)
        yearly.append({"year": y, "value": round(val), "invested": monthly * n_y})

    return {
        "totalValue": round(total_value),
        "totalInvested": round(total_invested),
        "totalGain": round(total_gain),
        "multiplier": round(multiplier, 1),
        "yearlyBreakdown": yearly,
    }
