import { VueWrapper, mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE } from "@/settings";

describe('Wordle Board', () => {
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

  describe("end of game messages", () => {
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
  })

  describe("word of the day validation", () => {
    test.each( // string formatting not working
      [
        {wordOfTheDay: "BRAD", reason: "Word of the day must be exactly 5 letters long"},
        {wordOfTheDay: "tests", reason: "Word of the day must be all uppercase letters"},
        {wordOfTheDay: "ABCDE", reason: "Word of the day must be a real english word"},
      ]
    )('if $wordOfTheDay is provided then a warning is emitted because $reason', async ({wordOfTheDay}) => {
      console.warn = vi.fn();

      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).toHaveBeenCalled();
    })
    

    test("no warning is emitted if the word of the day is a real english word, all in upper case containing exactly five characters", async () => {
      console.warn = vi.fn();

      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).not.toHaveBeenCalled();
    })
  })

  describe("player guess validation", () => {
    test.todo("player guesses are limited to 5 letters");
    test.todo("player guesses can only be submitted if they are real words");
    test.todo("player guesses are not case sensitive");
    test.todo("playuer guesses can only contain characters");
  })
})
