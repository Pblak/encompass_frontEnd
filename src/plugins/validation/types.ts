export interface validationRule {
    (v: string): boolean | string;
}