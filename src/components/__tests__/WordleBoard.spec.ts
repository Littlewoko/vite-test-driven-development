import { VueWrapper, mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

describe('WorldeBoard', () => {
  const wordOfTheDay = "TESTS";

  let wrapper: ReturnType<typeof mount>;
  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerSubmitsGuess(guess: string) {
    const guessInput = wrapper.find("input[type=text]");
    await guessInput.setValue(guess);
    await guessInput.trigger("keydown.enter");
  }

  test("A victory message appears when the user makes a guess that matches the word of the day", async () => {
    await playerSubmitsGuess(wordOfTheDay);

    expect(wrapper.text()).toContain(VICTORY_MESSAGE);
  })

  test("a defeat message appears if the user makes a guess that is incorrect", async () => {
    await playerSubmitsGuess("WRONG");

    expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
  })

  test("no end-of-game message appears if the user has not yet made a guess", async () => {
    const wrapper = mount(WordleBoard, { props: { wordOfTheDay } })

    expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
    expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
  });

  test("if a word of the day provided does not have exactly 5 letters then a warning is emitted", async () => {
    console.warn = vi.fn();

    mount(WordleBoard, { props: { wordOfTheDay: "BRAD" } })

    expect(console.warn).toHaveBeenCalled();
  })

  test("if the word of the day is not all uppercase then a warning is emitted", async () => {
    console.warn = vi.fn();

    mount(WordleBoard, { props: { wordOfTheDay: wordOfTheDay.toLowerCase() } })

    expect(console.warn).toHaveBeenCalled();
  })

  test("if the word of the day is not a real english word then a warning is emtted", async () => {
    console.warn = vi.fn();

    mount(WordleBoard, { props: { wordOfTheDay: "ABCDE" } })

    expect(console.warn).toHaveBeenCalled();
  })
})
