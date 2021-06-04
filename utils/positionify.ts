export function positionify(place: number) {
  const placeStr = place.toString();
  switch (placeStr.slice(-1)) {
    case "1":
      return `${place}st`;
    case "2":
      return `${place}nd`;
    case "3":
      return `${place}rd`;
    default:
      return `${place}th`;
  }
}
