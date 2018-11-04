require 'httparty'

class WeatherParser
  def current_conditions(query)
    latitude = query[:latitude]
    longitude = query[:longitude]


    response = HTTParty.get("https://api.darksky.net/forecast/#{ENV["DARK_SKY_KEY"]}/#{latitude},#{longitude}?units=auto&exclude=[minutely,hourly,daily,flags]")

    weather_data = response["currently"]
    arr = ["summary", "icon", "temperature"]
    summary, icon, temperature = weather_data.values_at(*arr).compact

    location = get_address(latitude, longitude)

    {
      summary:summary,
      icon: icon,
      temperature: temperature,
      location: location
    }
  end

  def get_address(latitude, longitude)
    response = HTTParty.get("http://dev.virtualearth.net/REST/v1/Locations/#{latitude},#{longitude}\?o\=json\&key\=#{ENV["BING_MAP_KEY"]}")

    response["resourceSets"][0]["resources"][0]["address"]["formattedAddress"]
  end
end
