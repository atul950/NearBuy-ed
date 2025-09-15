import math
from typing import Tuple, Optional

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points on Earth
    using the Haversine formula.
    
    Args:
        lat1, lon1: Latitude and longitude of first point in decimal degrees
        lat2, lon2: Latitude and longitude of second point in decimal degrees
    
    Returns:
        Distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of Earth in kilometers
    r = 6371
    
    return c * r

def filter_shops_by_distance(shops: list, user_lat: float, user_lon: float, max_distance: float = 10) -> list:
    """
    Filter shops by distance from user location.
    
    Args:
        shops: List of shop dictionaries with latitude and longitude
        user_lat: User's latitude
        user_lon: User's longitude
        max_distance: Maximum distance in kilometers (default: 10km)
    
    Returns:
        Filtered list of shops within the specified distance
    """
    nearby_shops = []
    
    for shop in shops:
        if shop.get('latitude') and shop.get('longitude'):
            distance = calculate_distance(
                user_lat, user_lon,
                float(shop['latitude']), float(shop['longitude'])
            )
            
            if distance <= max_distance:
                shop['distance'] = round(distance, 2)
                nearby_shops.append(shop)
    
    # Sort by distance
    return sorted(nearby_shops, key=lambda x: x.get('distance', float('inf')))

def format_shop_timings(timings: list) -> dict:
    """
    Format shop timings into a more readable structure.
    
    Args:
        timings: List of timing dictionaries with day, open_time, close_time
    
    Returns:
        Dictionary with formatted timings
    """
    days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    formatted_timings = {}
    
    for timing in timings:
        day = timing.get('day', '').capitalize()
        open_time = timing.get('open_time', '')
        close_time = timing.get('close_time', '')
        
        if open_time and close_time:
            formatted_timings[day] = f"{open_time} - {close_time}"
        else:
            formatted_timings[day] = "Closed"
    
    # Ensure all days are present
    for day in days_order:
        if day not in formatted_timings:
            formatted_timings[day] = "Closed"
    
    return formatted_timings

def validate_email(email: str) -> bool:
    """
    Simple email validation.
    
    Args:
        email: Email string to validate
    
    Returns:
        True if email format is valid, False otherwise
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone: str) -> bool:
    """
    Simple phone number validation for Indian numbers.
    
    Args:
        phone: Phone number string to validate
    
    Returns:
        True if phone format is valid, False otherwise
    """
    import re
    # Indian phone number pattern (10 digits, optionally starting with +91)
    pattern = r'^(\+91)?[6-9]\d{9}$'
    return re.match(pattern, phone.replace(' ', '').replace('-', '')) is not None

def paginate_results(query_results: list, page: int = 1, per_page: int = 20) -> dict:
    """
    Paginate query results.
    
    Args:
        query_results: List of results to paginate
        page: Page number (1-indexed)
        per_page: Number of items per page
    
    Returns:
        Dictionary with paginated results and metadata
    """
    total = len(query_results)
    start = (page - 1) * per_page
    end = start + per_page
    
    items = query_results[start:end]
    
    return {
        'items': items,
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': math.ceil(total / per_page),
        'has_prev': page > 1,
        'has_next': end < total
    }
