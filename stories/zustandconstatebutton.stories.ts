import type { Meta, StoryObj } from '@storybook/react'
import { ZustandConstatebutton } from './ZustandConstatebutton'

const meta = {
  title: 'Example/ZustandConstatebutton',
  component: ZustandConstatebutton,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    steps: 2,
  },
} satisfies Meta<typeof ZustandConstatebutton>

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
