// Type-level compatibility checks between new public types (from src)
// and legacy published types (from ../../typescript/index.d.ts)
// If any of these assertions fail at compile time, this test will fail.

// Compare OLD (legacy hand-written d.ts) vs NEW (generated dist d.ts)
import type {
  ConfirmDialogProps as NewConfirmDialogProps,
  ConfirmDialog as NewConfirmDialog,
  ConfirmationContext as NewConfirmationContext,
} from '../../dist';

import type {
  ConfirmDialogProps as OldConfirmDialogProps,
  ConfirmDialog as OldConfirmDialog,
  ConfirmationContext as OldConfirmationContext,
} from '../../typescript';

// Sample generics for testing generic type parameters
interface P1 { a: string; optional?: number }
interface R1 { v: number }

// Type-level assignability checks (produce compile errors if incompatible)
type Assert<T extends true> = T;
type IsAssignable<A, B> = [A] extends [B] ? true : false;

// ConfirmDialogProps (both directions)
type _CDP_new_to_old = Assert<IsAssignable<NewConfirmDialogProps<P1, R1>, OldConfirmDialogProps<P1, R1>>>;
type _CDP_old_to_new = Assert<IsAssignable<OldConfirmDialogProps<P1, R1>, NewConfirmDialogProps<P1, R1>>>;

// ConfirmDialog (both directions)
type _CD_new_to_old = Assert<IsAssignable<NewConfirmDialog<P1, R1>, OldConfirmDialog<P1, R1>>>;
type _CD_old_to_new = Assert<IsAssignable<OldConfirmDialog<P1, R1>, NewConfirmDialog<P1, R1>>>;

// Jest requires at least one runtime test; this is a no-op.
test('type compatibility: new vs old', () => {
  expect(true).toBe(true);
});
