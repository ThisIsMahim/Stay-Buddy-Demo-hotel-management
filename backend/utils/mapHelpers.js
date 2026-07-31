async function convertMapUrlToPointCustom(url) {
  try {
    const res = await fetch(url, { redirect: 'manual' });
    const location = res.headers.get('location') || res.headers.get('Location');
    
    // If we're redirected, the new URL contains the coordinates
    let locUrl = location || url;

    // Pattern 1: @lat,lng
    let match = locUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (!match) {
      // Pattern 2: !3dlat!4dlng
      match = locUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    }
    
    if (match) {
      return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };
    }
    
    // If it's a redirect that still needs resolution (short link redirecting to another short link)
    if (location && res.status >= 300 && res.status < 400) {
      const redirectedRes = await fetch(location, { redirect: 'manual' });
      const doubleLocation = redirectedRes.headers.get('location') || redirectedRes.headers.get('Location');
      if (doubleLocation) {
        match = doubleLocation.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || doubleLocation.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
        if (match) {
          return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching map coordinates natively:", error);
    return null;
  }
}

module.exports = {
  convertMapUrlToPointCustom
};
