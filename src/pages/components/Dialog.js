import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import {
  Grid,
  Section,
  Dialog as DialogComponent,
  Link,
} from '@digicatapult/ui-component-library'

import { getProjectTypeColour } from '../../utils/theme'

const Wrapper = styled.div`
  position: absolute;
  top: 5ch;
  left: 5ch;
`

export default function Dialog({ onClose, feature }) {
  const properties = feature?.properties

  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    dialog.show()
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    dialog?.addEventListener('close', onClose)
    return () => dialog?.removeEventListener('close', onClose)
  }, [onClose])

  return (
    <Wrapper>
      <DialogComponent
        width="60ch"
        maxHeight="80ch"
        ref={dialogRef}
        includeClose={true}
      >
        <Section
          headingLevel={2}
          title={properties?.['Name']}
          padding="1em 1.5em"
          headingSize="2em"
          background="white"
        >
          <Grid
            areas={[
              ['lead', 'link'],
              ['details', 'details'],
              ['funding', 'funding'],
            ]}
            rows={['auto']}
            columns={['auto']}
            gap="1em"
          >
            <Grid.Panel area="lead">
              <span>{properties?.['Name of Lead Partner']}</span>
            </Grid.Panel>

            <Grid.Panel area="link" justifySelf="right">
              <Link text="Link to project" href={properties?.['Link']} />
            </Grid.Panel>

            <Grid.Panel area="details">
              <Section
                headingLevel={3}
                title="Project details"
                padding="1em 1.5em"
                margin="0 -1.5em"
                background={getProjectTypeColour(
                  properties?.['Project Type'],
                  '50'
                )}
                headingSize="1em"
              >
                {properties?.['Scope/Goal']}
              </Section>
            </Grid.Panel>

            <Grid.Panel area="funding">
              <Section
                headingLevel={3}
                title="Funding"
                padding="0em 0"
                headingSize="1em"
                background="white"
              >
                {properties?.['Funding']}
              </Section>
            </Grid.Panel>
          </Grid>
        </Section>
      </DialogComponent>
    </Wrapper>
  )
}
