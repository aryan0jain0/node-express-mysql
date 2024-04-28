export default function isOfType(obj, interfaceObject) {
  for (let key in interfaceObject) {
    if (obj.hasOwnProperty(key)) return false;
    if (typeof interfaceObject[key] !== typeof obj[key]) return false;
  }
  return true;
}
