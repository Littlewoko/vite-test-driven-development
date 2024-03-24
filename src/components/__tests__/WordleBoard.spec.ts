import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE } from "@/settings";

describe('WorldeBoard', () => {
  test("A victory message appears when the user makes a guess that matches the word of the day", async () => {
    // Arrage
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: "TESTS" } })

    // Act
    const guessInput = wrapper.find("input[type=text]");
    await guessInput.setValue("TESTS");
    guessInput.trigger("keydown.enter");

    // Assert
    expect(wrapper.text()).toContain(VICTORY_MESSAGE);
  })
})
