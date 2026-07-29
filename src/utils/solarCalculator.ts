/**
 * Calculates solar times (Sunrise, Sunset, Zenith, Golden Hour) based on latitude, longitude, and date.
 * Relies on standard low-precision astronomical equations.
 */
export interface SolarTimes {
  sunrise: string; // HH:MM
  sunset: string;  // HH:MM
  zenith: string;  // HH:MM
  goldenHour: string; // HH:MM
}

export function calculateSolarTimes(latitude: number, longitude: number, date: Date = new Date()): SolarTimes {
  // Day of year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Simple solar calculation approximation:
  // Declination of the sun
  const declination = 23.45 * Math.sin(((2 * Math.PI) / 365) * (284 + dayOfYear));
  const decRad = (declination * Math.PI) / 180;
  const latRad = (latitude * Math.PI) / 180;

  // Hour angle (H) for sunrise/sunset (zenith angle is approximately 90.833 degrees)
  const zenithRad = (90.833 * Math.PI) / 180;
  let cosH = (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));

  // Clamping cosH to prevent NaN if the sun never rises/sets
  cosH = Math.max(-1, Math.min(1, cosH));
  const H = (Math.acos(cosH) * 180) / Math.PI; // in degrees

  // Equation of Time (EoT) in minutes
  const B = ((360 / 365) * (dayOfYear - 81) * Math.PI) / 180;
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // Time correction for longitude
  // Standard meridian for timezone
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60;
  const standardMeridian = timezoneOffsetHours * 15;
  const longitudeCorrection = 4 * (longitude - standardMeridian);

  // Solar noon (Zenith) in minutes from midnight local time
  const solarNoonMin = 720 - longitudeCorrection - equationOfTime;

  // Sunrise and Sunset in minutes from midnight
  const sunriseMin = solarNoonMin - H * 4;
  const sunsetMin = solarNoonMin + H * 4;

  // Golden Hour start (evening golden hour: approx 1 hour before sunset)
  const goldenHourMin = sunsetMin - 60;

  const formatMin = (minutes: number): string => {
    let m = Math.round(minutes);
    if (m < 0) m += 1440;
    m %= 1440;
    const hrs = Math.floor(m / 60);
    const mins = Math.floor(m % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return {
    sunrise: formatMin(sunriseMin),
    sunset: formatMin(sunsetMin),
    zenith: formatMin(solarNoonMin),
    goldenHour: formatMin(goldenHourMin),
  };
}
