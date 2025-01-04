export const chatgptPrompt = (dateOne: string, dateTwo: string) => `
Based on the two pieces of data, I want you to compare and contrast them. And the response should follow the following format in markdown:

## Comparison and Contrast of **${dateOne}** and **${dateTwo}**
<br>
### Similarities:
<br>
1. **Weather Conditions**:
   - e.g. Both datasets describe "Partially cloudy" conditions with similar descriptions ("Partly cloudy throughout the day").
   -  e.g. No precipitation (precip: 0) is expected in both datasets, and the probability of precipitation (precipprob) is zero.
<br>
2. **Stations**:
  -  e.g.  Both datasets use the same weather stations (KSJC, KLVK, E6873, KNUQ) for data collection.
<br>
3. **General Trends**:
   - e.g. Both datasets show similar temperature ranges, with daytime highs around 16°C and nighttime lows around 4-5°C.
   - e.g. The wind speed, wind direction, and humidity levels are comparable in both datasets.
<br>
#### Differences:
<br>
1. **Query Cost**:
   - e.g. **${dateOne}** has a higher query cost (24) compared to **${dateTwo}** (1), suggesting **${dateOne}** might include more detailed or extensive data.
<br>
2. **Temperature Extremes**:
   - e.g. **${dateOne}** has a slightly higher minimum temperature (4.9°C) compared to **${dateTwo}** (4.3°C).
   - e.g. **${dateTwo}** has a slightly higher maximum temperature (16.5°C) compared to **${dateOne}** (16°C).

<br>
3. **Feels-Like Temperatures**:
   - e.g. The "feels-like" minimum temperature in **${dateTwo}** (2.1°C) is lower than in **${dateOne}** (3.6°C), indicating a colder perceived temperature in **${dateTwo}**.
<br>
4. **Wind Gusts and Speeds**:
   - e.g. **${dateOne}** reports higher wind gusts (13 km/h) and wind speeds (16.6 km/h) compared to **${dateTwo}** (11.2 km/h and 12.6 km/h, respectively).
<br>
5. **Cloud Cover**:
   - e.g. **${dateTwo}** has a higher average cloud cover (50.3%) compared to **${dateOne}** (37.9%).
<br>
6. **Solar Radiation and Energy**:
   - e.g. **${dateOne}** has higher solar radiation (133.7 W/m²) and solar energy (11.7 MJ/m²) compared to **${dateTwo}** (107.1 W/m² and 9.2 MJ/m², respectively).

7. **Additional Data in ${dateTwo}**:
<br>
   - e.g. **${dateTwo}** includes a currentConditions field, providing real-time weather data for the specified time (20:45:00).
   - e.g. **${dateTwo}** also includes an additional station (E8213) not present in **${dateOne}**.
<br>

#### Summary:
<br>
   - e.g. Both datasets describe similar weather conditions for the same location but on consecutive days.
   - e.g. **${dateOne}** provides more detailed hourly data with higher query cost, while **${dateTwo}** includes additional features like currentConditions and a mix of observed and forecasted data.
  **${dateTwo}** shows slightly colder perceived temperatures and higher cloud cover, while **${dateOne}** has higher wind speeds and solar radiation.

`