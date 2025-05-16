export class Utils {

  public static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static throw(probability = 1.0): void {
    if (Math.random() < probability) {
      throw new Error("Mocked up error.");
    }
  }

  public static toSentenceCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

}