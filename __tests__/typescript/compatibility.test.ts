// Type-level compatibility checks between new public types (from src)
// and legacy published types (from ../../typescript/index.d.ts)
// If any of these assertions fail at compile time, this test will fail.

import type {
  ConfirmDialogProps as NewConfirmDialogProps,
  ConfirmDialog as NewConfirmDialog,
  ConfirmationContext as NewConfirmationContext,
} from 'src';

import type {
  ConfirmDialogProps as OldConfirmDialogProps,
  ConfirmDialog as OldConfirmDialog,
  ConfirmationContext as OldConfirmationContext,
} from '../../typescript';

type Assert<T extends true> = T;
type IsAssignable<A, B> = [A] extends [B] ? true : false;

// Sample generics for testing generic type parameters
interface P1 { a: string; optional?: number }
interface R1 { v: number }

// ConfirmDialogProps equivalence (both directions)
type _CDP_new_to_old = Assert<IsAssignable<NewConfirmDialogProps<P1, R1>, OldConfirmDialogProps<P1, R1>>>;
type _CDP_old_to_new = Assert<IsAssignable<OldConfirmDialogProps<P1, R1>, NewConfirmDialogProps<P1, R1>>>;

// ConfirmDialog equivalence (both directions)
type _CD_new_to_old = Assert<IsAssignable<NewConfirmDialog<P1, R1>, OldConfirmDialog<P1, R1>>>;
type _CD_old_to_new = Assert<IsAssignable<OldConfirmDialog<P1, R1>, NewConfirmDialog<P1, R1>>>;

// ConfirmationContext equivalence (both directions)
type _CC_new_to_old = Assert<IsAssignable<NewConfirmationContext, OldConfirmationContext>>;
type _CC_old_to_new = Assert<IsAssignable<OldConfirmationContext, NewConfirmationContext>>;

// Jest requires at least one runtime test; this is a no-op.
test('type compatibility: new vs old', () => {
  expect(true).toBe(true);
});

