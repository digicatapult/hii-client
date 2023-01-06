import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import {
  Grid,
  Section,
  Dialog as DialogComponent,
  Link,
} from '@digicatapult/ui-component-library'

const Wrapper = styled.div`
  position: absolute;
  top: 5ch;
  left: 5ch;
`

export default function Dialog({ open, setOpen }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (open) {
      dialog.show()
    } else {
      dialog.close()
    }

    const listener = () => {
      setOpen(false)
    }
    dialog?.addEventListener('close', listener)

    return () => dialog?.removeEventListener('close', listener)
  }, [open, setOpen])

  //   console.log(feature)
  return (
    <Wrapper>
      <DialogComponent ref={dialogRef} includeClose={true}>
        <Section
          headingLevel={2}
          title="Name"
          padding="1em 1.5em"
          width="47ch"
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
              <span>Name of Lead Partner</span>
            </Grid.Panel>

            <Grid.Panel area="link" justifySelf="right">
              <Link
                text="Link to project"
                href="https://gtr.ukri.org/projects?ref=EP%2FG06279X%2F1"
              />
            </Grid.Panel>

            <Grid.Panel area="details">
              <Section
                headingLevel={3}
                title="Project details"
                padding="1em 1.5em"
                margin="0 -1.5em"
                background="#dfe667"
                headingSize="1em"
              >
                Scope / goal - The £33 million Low Carbon Hydrogen Supply
                competition aimed to accelerate the development of low carbon
                bulk hydrogen supply solutions in specific sectors. It was aimed
                at projects at a TRL of 4 to 7, which could result in lower
                capital or operating costs when compared to Steam Methane
                Reformation with Carbon Capture & Storage (SMR+CCS), or improve
                the carbon capture rates at a comparable cost.
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
                £240m
              </Section>
            </Grid.Panel>
          </Grid>
        </Section>
      </DialogComponent>
    </Wrapper>
  )
}
