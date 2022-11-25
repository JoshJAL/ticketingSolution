export function OnMouseEnter(e: any) {
  e.target.style['background-color'] = 'rgba(0, 0, 0, 0.75)';
  e.target.style['color'] = 'rgba(255, 255, 255, 0.75)';
}

export function OnMouseOut(e: any) {
  e.target.style['background-color'] = 'rgba(0, 0, 0, 0.25)';
  e.target.style['color'] = 'black';
}
