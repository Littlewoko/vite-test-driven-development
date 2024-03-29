import { VueWrapper, mount } from '@vue/test-utils'
import WordleBoard from '../WordleBoard.vue'
import { VICTORY_MESSAGE, DEFEAT_MESSAGE, WORD_SIZE, MAX_GUESSES_COUNT } from "@/settings";
import WordleGuessDisplay from '../WordleGuessDisplay.vue';
import WordleLetterDisplay from '../WordleLetterDisplay.vue';

describe('Wordle Board', () => {
  const wordOfTheDay = "TESTS";

  let wrapper: ReturnType<typeof mount>;
  beforeEach(() => {
    wrapper = mount(WordleBoard, { props: { wordOfTheDay } })
  })

  async function playerTypesGuess(guess: string) {
    await wrapper.find("input[type=text]").setValue(guess);
  }

  async function playerSubmitsGuess() {
    await wrapper.find("input[type=text]").trigger("keydown.enter");
  }

  async function playerTypesAndSubmitsGuess(guess: string) {
    await playerTypesGuess(guess);
    await playerSubmitsGuess();
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
      const guesses = [
        "HELLO",
        "GUESS",
        "MAKER",
        "HATER",
        "CODER",
        "MANEB"
      ]

      for (let i = 0; i < numberOfGuesses; i++) {
        await playerTypesAndSubmitsGuess(guesses[i]);
      }

      if (shouldSeeDefeatMessage) {
        expect(wrapper.text()).toContain(DEFEAT_MESSAGE);
      }
    })
  })

  describe("end of game messages", () => {
    test("A victory message appears when the user makes a guess that matches the word of the day", async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay);

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

      expect(wrapper.find("input[type=text]").attributes("autofocus")).not.toBeUndefined();

      await wrapper.find("input[type=text]").trigger("blur");
      expect(document.activeElement).toBe(wrapper.find("input[type=text]").element);
    })

    test("player input is cleared after each submission", async () => {
      await playerTypesAndSubmitsGuess("HELLO");

      expect(wrapper.find<HTMLInputElement>("input[type=text").element.value).toEqual("");
    })

    test(`player guesses are limited to 5 letters`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay + "EXTRA");

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    test("player guesses can only be submitted if they are real words", async () => {
      await playerTypesAndSubmitsGuess("ABCDE");

      expect(wrapper.text()).not.toContain(VICTORY_MESSAGE);
      expect(wrapper.text()).not.toContain(DEFEAT_MESSAGE);
    });

    test("player guesses are not case sensitive", async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay.toLowerCase());

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    });

    test("player guesses can only contain characters", async () => {
      await playerTypesAndSubmitsGuess("H£A7T");

      expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("HAT");
    });

    test("non-letter characters do not render on the screen while being typed", async () => {
      await playerTypesAndSubmitsGuess("333");
      await playerTypesAndSubmitsGuess("456");
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
        await playerTypesAndSubmitsGuess(guesses[i]);
      }

      expect(wrapper.find("input[type=text").attributes("disabled")).not.toBeUndefined();
    })

    test("The player can no longer type after a correct guess has been made", async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay);

      expect(wrapper.find("input[type=text").attributes("disabled")).not.toBeUndefined();
    })

    test("player cannot submit guess that has already been submitted", async () => {
      await playerTypesAndSubmitsGuess("WRONG");
      await playerTypesAndSubmitsGuess("WRONG");

      expect(wrapper.find<HTMLInputElement>("input[type=text]").element.value).toEqual("WRONG");
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
      await playerTypesAndSubmitsGuess(guess);
    }

    for (const guess of guesses) {
      expect(wrapper.text()).toContain(guess);
    }
  })

  describe(`The game should display ${MAX_GUESSES_COUNT + 1} fields when in play, and ${MAX_GUESSES_COUNT} when game ends`, async () => {
    test(`there should be exactly ${MAX_GUESSES_COUNT + 1} display fields when the game is in play`, async () => {
      expect(wrapper.findAllComponents(WordleGuessDisplay)).toHaveLength(MAX_GUESSES_COUNT + 1);
    })

    test(`there should be exactly ${MAX_GUESSES_COUNT} display fields when the player wins the game`, async () => {
      await playerTypesAndSubmitsGuess(wordOfTheDay);

      expect(wrapper.findAllComponents(WordleGuessDisplay)).toHaveLength(MAX_GUESSES_COUNT);
    })

    test(`there should be exactly ${MAX_GUESSES_COUNT} display fields when the player loses the game`, async () => {
      const guesses = [
        "HELLO",
        "GUESS",
        "MAKER",
        "HATER",
        "CODER",
        "MANEB"
      ]

      for (let i = 0; i < guesses.length; i++) {
        await playerTypesAndSubmitsGuess(guesses[i]);
      }

      expect(wrapper.findAllComponents(WordleGuessDisplay)).toHaveLength(MAX_GUESSES_COUNT);
    })
  })

  describe("Player hints and feedback", () => {
    test("hints are not displayed until the user submits a guess", async () => {
      expect(wrapper.find("[data-letter-feedback]").exists(), 'feedback was rendered before guess submission').exist.toBe(false);

      await playerTypesGuess(wordOfTheDay);
      expect(wrapper.find("[data-letter-feedback]").exists(), 'feedback was rendered while the user was typing but before submission').exist.toBe(false);

      await playerSubmitsGuess();
      expect(wrapper.find("[data-letter-feedback]").exists(), 'feedback was not provided after submission').exist.toBe(true);
    })
  })
  // world wrong
  describe.each([
    {
      position: 0,
      expectedFeedback: "correct",
      reason: "W is the first letter of 'WORLD' and 'WRONG'"
    },
    {
      position: 1,
      expectedFeedback: "almost",
      reason: "R exists in both words, but it is in position 2 of 'WORLD'"
    },
    {
      position: 2,
      expectedFeedback: "almost",
      reason: "R exists in both words, but it is in position 1 of 'WORLD'"
    },
    {
      position: 3,
      expectedFeedback: "incorrect",
      reason: "N is not present in 'WORLD'"
    },
    {
      position: 4,
      expectedFeedback: "incorrect",
      reason: "G is not present in 'WORLD'"
    }
  ])("If the word of the day is 'WORLD' and the player types 'WRONG'", ({ position, expectedFeedback, reason }) => {
    const _wordOfTheDay = "WORLD";
    const _playerGuess = "WRONG";

    test(`the feedback for '${_playerGuess[position]}' (index: ${position}) should be '${expectedFeedback}' because ${reason}`, async () => {
      wrapper = mount(WordleBoard, { props: { wordOfTheDay: _wordOfTheDay } });

      await playerTypesAndSubmitsGuess(_playerGuess);

      const actualFeedback = wrapper.findAll("[data-letter]").at(position)?.attributes("data-letter-feedback");

      expect(actualFeedback).toEqual(expectedFeedback);
    });
  })

  describe("on screen keyboard", () => {
    test("on screen keyboard indicates letters the player has used in guesses", async () => {
      const GUESS = "TOAST";

      let usedButtons = wrapper.findAll("[data-used=true]");
      expect(usedButtons.length).toBe(0);

      await playerTypesAndSubmitsGuess(GUESS);
      usedButtons = wrapper.findAll("[data-used=true]");
      expect(usedButtons.length).toBe(4);

      usedButtons.forEach((elementWrapper) => {
        const dataKey = elementWrapper.attributes("data-key");
        expect(GUESS.includes(dataKey as string)).toBe(true);
      });
    });

    test("on screen keybaord displays all possible letters for input", async () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      for (const letter of alphabet) {
        const button = wrapper.find(`button[data-key="${letter}"]`);
        expect(button.exists()).toBe(true);
      }
    });

    test("player can make a guess purely using the on screen keyboard", async () => {
      const GUESS = "WORDS";
      const inputElement = wrapper.find("input[type=text]").element as HTMLInputElement;
      expect(inputElement.value).toBe("");

      for (const letter of GUESS) {
        const button = wrapper.find(`button[data-key="${letter}"]`);
        await button.trigger('click');
      }

      expect(inputElement.value).toBe(GUESS);
    });

    test("player can submit a guess using the on screen keyboard", async () => {
      await playerTypesGuess(wordOfTheDay);

      const button = wrapper.find(`button[data-key="+"]`);
      await button.trigger('click');

      expect(wrapper.text()).toContain(VICTORY_MESSAGE);
    })

    test("player can delete their in progress guess using the on screen keyboard", async () => {
      await playerTypesGuess(wordOfTheDay);
      const button = wrapper.find(`button[data-key="-"]`);

      const inputElement = wrapper.find("input[type=text]").element as HTMLInputElement;
      expect(inputElement.value).toBe(wordOfTheDay);
      
      for(let i = wordOfTheDay.length - 1; i >= 0; i--) {
        await button.trigger('click');
        expect(inputElement.value).toBe(wordOfTheDay.slice(0, i));
      }
    })
  })
})
