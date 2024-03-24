import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WorldleBoard from '../WorldleBoard.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(WorldleBoard, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
