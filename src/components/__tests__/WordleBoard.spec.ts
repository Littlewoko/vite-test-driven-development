import { mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

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

  test("a defeat message appears if the user makes a guess that is incorrect", async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay: "TESTS" } })

    const guessInput = wrapper.find("input[type=text]");
    await guessInput.setValue("WRONG");
    guessInput.trigger("keydown.enter");

    expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
  })

  test.todo("no end-of-game message appears if the user has not yet made a guess");
})
