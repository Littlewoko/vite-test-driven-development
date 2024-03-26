import { VueWrapper, mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE, MAX_GUESSES_COUNT } from "@/settings";

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

  describe.each(
    Array.from(
      { length: MAX_GUESSES_COUNT + 1 },
      (_, numberOfGuesses) => ({
        numberOfGuesses,
        shouldSeeDefeatMessage: numberOfGuesses === MAX_GUESSES_COUNT
      })
    )
  )(`a defeat message appears if the player makes ${MAX_GUESSES_COUNT} incorrect guesses`, async ({ numberOfGuesses, shouldSeeDefeatMessage }) => {
    test(`therefor for ${numberOfGuesses}, a defeat message should ${shouldSeeDefeatMessage ? '' : 'not'} appear`, async () => {
      for (let i = 0; i < numberOfGuesses; i++) {
        await playerSubmitsGuess("WRONG");
      }

      if (shouldSeeDefeatMessage) {
        expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
      }
    })
  })

  describe("end of game messages", () => {
    test("A victory message appears when the user makes a guess that matches the word of the day", async () => {
      await playerSubmitsGuess(wordOfTheDay);

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    })

    test("no end-of-game message appears if the user has not yet made a guess", async () => {
      const wrapper = mount(WordleBoard, { props: { wordOfTheDay } })

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });
  })

  describe("word of the day validation", () => {
    beforeEach(() => {
      console.warn = vi.fn();
    })

    test.each( // string formatting not working
      [
        { wordOfTheDay: "BRAD", reason: `Word of the day must be exactly 5 letters long` },
        { wordOfTheDay: "tests", reason: "Word of the day must be all uppercase letters" },
        { wordOfTheDay: "ABCDE", reason: "Word of the day must be a real english word" },
      ]
    )('if $wordOfTheDay is provided then a warning is emitted because $reason', async ({ wordOfTheDay }) => {
      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).toHaveBeenCalled();
    })


    test(`no warning is emitted if the word of the day is a real english word, all in upper case containing exactly 5 characters`, async () => {
      mount(WordleBoard, { props: { wordOfTheDay } })

      expect(console.warn).not.toHaveBeenCalled();
    })
  })

  describe("player guess validation", () => {
    test("Player input maintains focus at all times", async () => {
      document.body.innerHTML = `<div id="app"></div>`;
      wrapper = mount(WordleBoard, {
        props: { wordOfTheDay },
        attachTo: "#app",
      });

      expect(wrapper.find("input[type=text").attributes("autofocus")).not.toBeUndefined();

      await wrapper.find("input[type=text").trigger("blur");
      expect(document.activeElement).toBe(wrapper.find("input[type=text").element);
    })

    test("player input is cleared after each submission", async () => {
      await playerSubmitsGuess("HELLO");

      expect(wrapper.find<HTMLInputElement>("input[type=text").element.value).toEqual("");
    })

    test(`player guesses are limited to 5 letters`, async () => {
      await playerSubmitsGuess(wordOfTheDay + "EXTRA");

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    test("player guesses can only be submitted if they are real words", async () => {
      await playerSubmitsGuess("ABCDE");

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });

    test("player guesses are not case sensitive", async () => {
      await playerSubmitsGuess(wordOfTheDay.toLowerCase());

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    test("playuer guesses can only contain characters", async () => {
      await playerSubmitsGuess("H£A7T");

      expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("HAT");
    });

    test("non-letter characters do not render on the screen while being typed", async () => {
      await playerSubmitsGuess("333");
      await playerSubmitsGuess("456");
      expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("");
    })

    test("The player can no longer type after the max amount of guesses have been made", async () => {
      const guesses = [
        "HELLO",
        "GUESS",
        "MAKER",
        "HATER",
        "CODER",
        "MANEB"
      ]

      for (let i = 0; i < guesses.length; i++) {
        await playerSubmitsGuess(guesses[i]);
      }

      expect(wrapper.find("input[type=text").attributes("disabled")).not.toBeUndefined();
    })

    test("The player can no longer type after a correct guess has been made", async () => {
      await playerSubmitsGuess(wordOfTheDay);

      expect(wrapper.find("input[type=text").attributes("disabled")).not.toBeUndefined();
    })
  })

  test("all previous guesses done by the player are visible on the page", async () => {
    const guesses = [
      "HELLO",
      "GUESS",
      "MAKER",
      "HATER",
      "CODER",
      "MANEB"
    ]

    for (const guess of guesses) {
      await playerSubmitsGuess(guess);
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess);
    }
  })
})
