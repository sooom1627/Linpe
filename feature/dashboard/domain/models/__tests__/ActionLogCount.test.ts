import { ActionStatus, ActionType, statusToTypeMap } from "../ActionLogCount";

describe("ActionLogCount", () => {
  describe("ActionStatus", () => {
    it("正しいステータス値を持つこと", () => {
      expect(ActionStatus.ADD).toBe("add");
      expect(ActionStatus.TODAY).toBe("Today");
      expect(ActionStatus.IN_WEEKEND).toBe("inWeekend");
      expect(ActionStatus.SKIP).toBe("Skip");
      expect(ActionStatus.READ).toBe("Read");
      expect(ActionStatus.BOOKMARK).toBe("Bookmark");
    });
  });

  describe("ActionType", () => {
    it("正しいタイプ値を持つこと", () => {
      expect(ActionType.ADD).toBe("add");
      expect(ActionType.SWIPE).toBe("swipe");
      expect(ActionType.READ).toBe("read");
    });
  });

  describe("statusToTypeMap", () => {
    it("ADDステータスが正しくマッピングされていること", () => {
      expect(statusToTypeMap[ActionStatus.ADD]).toBe(ActionType.ADD);
    });

    it("SWIPEステータスが正しくマッピングされていること", () => {
      expect(statusToTypeMap[ActionStatus.TODAY]).toBe(ActionType.SWIPE);
      expect(statusToTypeMap[ActionStatus.IN_WEEKEND]).toBe(ActionType.SWIPE);
      expect(statusToTypeMap[ActionStatus.SKIP]).toBe(ActionType.SWIPE);
    });

    it("READステータスが正しくマッピングされていること", () => {
      expect(statusToTypeMap[ActionStatus.READ]).toBe(ActionType.READ);
      expect(statusToTypeMap[ActionStatus.BOOKMARK]).toBe(ActionType.READ);
    });

    it("すべてのステータスがマッピングされていること", () => {
      // ActionStatusのすべてのキーがstatusToTypeMapに存在することを確認
      Object.values(ActionStatus).forEach((status) => {
        expect(statusToTypeMap[status]).toBeDefined();
      });
    });
  });
});
