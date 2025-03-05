import requests

SERPAPI_KEY = "API"

def get_hotels(location, checkin, checkout):
    """Fetches hotel data from SerpAPI."""
    params = {
        "engine": "google_hotels",
        "q": location,
        "check_in_date": checkin,
        "check_out_date": checkout,
        "api_key": SERPAPI_KEY
    }
    
    response = requests.get("https://serpapi.com/search", params=params)
    data = response.json()
    
    if "hotels_results" not in data:
        print("No hotels found. Please try again.")
        return []
    
    return data["hotels_results"]

def display_hotels(hotels):
    """Displays hotel options."""
    print("\nAvailable Hotels:")
    for idx, hotel in enumerate(hotels):
        print(f"{idx + 1}. {hotel['name']} - {hotel['price']} - {hotel.get('rating', 'No rating')}⭐")
    
def book_hotel(hotels):
    """Handles the hotel booking process."""
    choice = int(input("\nEnter the number of the hotel to book: ")) - 1
    if 0 <= choice < len(hotels):
        hotel = hotels[choice]
        print(f"\nBooking confirmed for: {hotel['name']}")
        print(f"Price: {hotel['price']}")
        print(f"Location: {hotel['location']}")
        print("Booking link:", hotel.get("link", "No link available"))
    else:
        print("Invalid selection.")

def main():
    """Main function to run the hotel booking system."""
    location = input("Enter the location: ")
    checkin = input("Enter check-in date (YYYY-MM-DD): ")
    checkout = input("Enter check-out date (YYYY-MM-DD): ")

    hotels = get_hotels(location, checkin, checkout)
    
    if hotels:
        display_hotels(hotels)
        book_hotel(hotels)

if __name__ == "__main__":
    main()
