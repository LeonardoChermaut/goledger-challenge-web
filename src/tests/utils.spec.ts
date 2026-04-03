import {
  formatReleaseDate,
  formatReleaseYear,
  getAgeRecommendationColor,
  getRatingColor,
  isValidAge,
  isValidEpisodeRating,
  isValidRating,
  isValidReleaseYear,
  sortByFavorite,
} from "../shared/utils/utils";

describe("Utils - Validation Functions", () => {
  describe("isValidRating", () => {
    it("should return true for valid ratings between 0 and 10 with up to one decimal", () => {
      expect(isValidRating(0)).toBe(true);
      expect(isValidRating(5)).toBe(true);
      expect(isValidRating(10)).toBe(true);
      expect(isValidRating(8.5)).toBe(true);
      expect(isValidRating(9.9)).toBe(true);
    });

    it("should return false for ratings outside the 0 to 10 range", () => {
      expect(isValidRating(-1)).toBe(false);
      expect(isValidRating(11)).toBe(false);
      expect(isValidRating(10.1)).toBe(false);
    });

    it("should return false for ratings with more than one decimal place", () => {
      expect(isValidRating(8.55)).toBe(false);
      expect(isValidRating(9.99)).toBe(false);
    });
  });

  describe("isValidAge", () => {
    it("should return true for valid ages between 0 and 18", () => {
      expect(isValidAge(0)).toBe(true);
      expect(isValidAge(10)).toBe(true);
      expect(isValidAge(18)).toBe(true);
    });

    it("should return false for ages outside the 0 to 18 range", () => {
      expect(isValidAge(-1)).toBe(false);
      expect(isValidAge(19)).toBe(false);
    });
  });

  describe("isValidEpisodeRating", () => {
    it("should return true for valid episode ratings between 0 and 10", () => {
      expect(isValidEpisodeRating(0)).toBe(true);
      expect(isValidEpisodeRating(5)).toBe(true);
      expect(isValidEpisodeRating(10)).toBe(true);
    });

    it("should return false for episode ratings outside the 0 to 10 range", () => {
      expect(isValidEpisodeRating(-1)).toBe(false);
      expect(isValidEpisodeRating(11)).toBe(false);
    });
  });

  describe("isValidReleaseYear", () => {
    it("should return true when itemYear is greater than or equal to seriesYear", () => {
      expect(isValidReleaseYear(2020, 2020)).toBe(true);
      expect(isValidReleaseYear(2021, 2020)).toBe(true);
    });

    it("should return false when itemYear is less than seriesYear", () => {
      expect(isValidReleaseYear(2019, 2020)).toBe(false);
    });
  });
});

describe("Utils - Color Functions", () => {
  describe("getAgeRecommendationColor", () => {
    it("should return green classes for age <= 10", () => {
      expect(getAgeRecommendationColor(0)).toBe(
        "bg-green-500/15 text-green-600",
      );
      expect(getAgeRecommendationColor(10)).toBe(
        "bg-green-500/15 text-green-600",
      );
    });

    it("should return yellow classes for age between 11 and 17", () => {
      expect(getAgeRecommendationColor(11)).toBe(
        "bg-yellow-500/15 text-yellow-600",
      );
      expect(getAgeRecommendationColor(17)).toBe(
        "bg-yellow-500/15 text-yellow-600",
      );
    });

    it("should return red classes for age >= 18", () => {
      expect(getAgeRecommendationColor(18)).toBe("bg-red-500/15 text-red-600");
      expect(getAgeRecommendationColor(21)).toBe("bg-red-500/15 text-red-600");
    });
  });

  describe("getRatingColor", () => {
    it("should return distinct classes for different rating ranges", () => {
      expect(getRatingColor(9)).toBe("bg-green-500/20 text-green-600");
      expect(getRatingColor(8)).toBe("bg-green-500/20 text-green-600");

      expect(getRatingColor(7)).toBe("bg-green-400/20 text-green-700");
      expect(getRatingColor(7.5)).toBe("bg-green-400/20 text-green-700");

      expect(getRatingColor(5)).toBe("bg-yellow-500/20 text-yellow-600");
      expect(getRatingColor(6.9)).toBe("bg-yellow-500/20 text-yellow-600");

      expect(getRatingColor(4)).toBe("bg-red-400/20 text-red-600");
      expect(getRatingColor(0)).toBe("bg-red-400/20 text-red-600");
    });
  });
});

describe("Utils - Formatting Functions", () => {
  describe("formatReleaseYear", () => {
    it("should return correct year for valid date strings", () => {
      expect(formatReleaseYear("2020-05-10")).toBe("2020");
    });

    it("should return 'Sem data' for invalid date strings", () => {
      expect(formatReleaseYear("")).toBe("Sem data");
      expect(formatReleaseYear("invalid-date")).toBe("Sem data");
    });
  });

  describe("formatReleaseDate", () => {
    it("should return formatted date for valid date strings", () => {
      expect(formatReleaseDate("2020-05-10T12:00:00Z")).toMatch(
        /\d{2}\/\d{2}\/\d{4}/,
      );
    });

    it("should return 'Sem data' for invalid date strings", () => {
      expect(formatReleaseDate("")).toBe("Sem data");
      expect(formatReleaseDate("invalid-date")).toBe("Sem data");
    });
  });
});

describe("Utils - Array Sorting Functions", () => {
  describe("sortByFavorite", () => {
    it("should sort favorite items first", () => {
      const items = [
        { id: 1, fav: false },
        { id: 2, fav: true },
        { id: 3, fav: false },
        { id: 4, fav: true },
      ];

      const sorted = sortByFavorite(items, (item) => item.fav);

      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(4);
      expect(sorted[2].id).toBe(1);
      expect(sorted[3].id).toBe(3);
    });

    it("should keep original order if favorites are already at the top", () => {
      const items = [
        { id: 1, fav: true },
        { id: 2, fav: false },
        { id: 3, fav: false },
      ];

      const sorted = sortByFavorite(items, (item) => item.fav);

      expect(sorted[0].id).toBe(1);
      expect(sorted[1].id).toBe(2);
      expect(sorted[2].id).toBe(3);
    });
  });
});
