export const projectColours = {
  'Feasibility Study': '#27847A',
  'Funding/Competition': '#80CC72',
  'Testing & certification': '#B6EFA0',
  'Innovation programme': '#DFE667',
  'R&D facility': '#C8B88A',
  'Government strategy': '#F1DDDF',
}

export const getProjectTypeColour = (project, alpha = 'FF') => {
  const colour = projectColours[project] ?? '#27847A'
  return `${colour}${alpha}`
}
