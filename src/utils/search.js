import stopWords from '../assets/stopWords.json'

const stopWordsSet = new Set(stopWords)

// search fields to use ordered by their term score contribution desc
export const searchFields = [
  { searchField: 'Name', geoJsonField: 'Name', scoreMultiplier: 1 },
  {
    searchField: 'LeadPartner',
    geoJsonField: 'Name of Lead Partner',
    scoreMultiplier: 1.0,
  },
  {
    searchField: 'Description',
    geoJsonField: 'Scope/Goal',
    scoreMultiplier: 0.5,
  },
].sort(({ scoreMultiplier: a }, { scoreMultiplier: b }) => b - a)

const matchProjectModifierTerms = (project, searchTerms) => {
  for (const { type, value, modifier } of searchTerms) {
    // first handle if the searchTerm is a plain term
    if (type === 'term' && modifier !== null) {
      // if we have a modifier we require exact match or not match
      const doesMatch = searchFields.some(({ geoJsonField }) => {
        const jsonValue = project.properties[geoJsonField].toLowerCase()
        return jsonValue.indexOf(value) !== -1
      })
      if (doesMatch && modifier === 'negative') {
        return false
      }
      if (!doesMatch && modifier === 'positive') {
        return false
      }
    }
  }
  return true
}

const matchProjectFields = (project, searchTerms) => {
  for (const { type, field, value, modifier } of searchTerms) {
    if (type === 'fieldMatch') {
      const doesMatch = searchFields.some(({ geoJsonField, searchField }) => {
        const jsonValue = project.properties[geoJsonField].toLowerCase()
        return field === searchField && jsonValue.indexOf(value) !== -1
      })
      // fields must match unless it's a negative match then they mustn't
      if (doesMatch && modifier === 'negative') {
        return false
      }
      if (!doesMatch && modifier !== 'negative') {
        return false
      }
    }
  }
  return true
}

// Returns tue if a project matches the search false otherwise
const getProjectTermsScore = (project, searchTerms) => {
  // counter so we can calculate the hit rate on scored plain terms
  let sum = 0,
    termCount = 0

  for (const { type, value, modifier } of searchTerms) {
    if (type === 'term' && modifier === null) {
      termCount = termCount + 1
      for (const { geoJsonField, scoreMultiplier } of searchFields) {
        const jsonValue = project.properties[geoJsonField].toLowerCase()
        if (jsonValue.indexOf(value) !== -1) {
          sum = sum + 1.0 * scoreMultiplier
          break
        }
      }
    }
  }
  return termCount === 0 ? 1 : sum / termCount
}

export const filterGeoJson = (geojson, searchTerms) => {
  // if there's no search terms then we can return the whole list
  if (searchTerms.length === 0) {
    return geojson
  }

  // we don't care about plain terms that are stop words. Exclude from the search
  const searchTermsFiltered = searchTerms
    .filter(({ type, value }) => type !== 'term' || !stopWordsSet.has(value))
    .map(({ value, ...rest }) => ({ ...rest, value: value.toLowerCase() }))

  const { features, ...rest } = geojson

  return {
    ...rest,
    // filter and sort "features" which correspond to projects using our filtered terms
    features: features
      // first exclude projects that don't match field matches or modifier terms
      .filter(
        (project) =>
          matchProjectModifierTerms(project, searchTermsFiltered) &&
          matchProjectFields(project, searchTermsFiltered)
      )
      // get score based on general term matching. All projects are equal up to this point
      .map((project) => ({
        project,
        score: getProjectTermsScore(project, searchTermsFiltered),
      }))
      // filter scores that are too low
      .filter(({ score }) => score >= 0.5)
      // now sort by score desc
      .sort(({ score: a }, { score: b }) => b - a)
      // and finally re-extract the projects
      .map(({ project }) => project),
  }
}
