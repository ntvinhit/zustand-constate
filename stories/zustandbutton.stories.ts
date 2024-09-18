import type { Meta, StoryObj } from '@storybook/react'
import { Zustandbutton } from './Zustandbutton'

const meta = {
  title: 'Example/Zustandbutton',
  component: Zustandbutton,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    steps: 2,
  },
} satisfies Meta<typeof Zustandbutton>

export default meta
type Story = StoryObj<typeof meta>

export const Step2: Story = {
  args: {
    steps: 2,
  },
}

export const Step4: Story = {
  args: {
    steps: 4,
  },
}
