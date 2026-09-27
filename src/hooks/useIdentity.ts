import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { generateId, generateRecordNumber } from '../utils/id';
import { processImageForStorage } from '../utils/image';
import { NPC_COMMENTS } from '../data/reactions';
import type {
  IdentityDistrict,
  IdentityProfile,
  IdentityRole,
  NightwireComment,
} from '../types/identity';

export interface IdentityDraft {
  image: string | null;
  source: 'preset' | 'upload' | null;
  presetId: string | null;
}

export interface IdentityFormValues {
  alias: string;
  role: IdentityRole;
  district: IdentityDistrict;
  wantedLevel: number;
  quote: string;
}

const DRAFT_KEY = 'vice-id:draft';
const EDITED_KEY = 'vice-id:edited-image';
const PROFILE_KEY = 'vice-id:profile';
const COMMENTS_KEY = 'vice-id:comments';
const RECORD_KEY = 'vice-id:record-number';

const EMPTY_DRAFT: IdentityDraft = { image: null, source: null, presetId: null };

const STORAGE_WARNING =
  "This device's local storage is full or unavailable, so your identity may not be saved after you leave. Try freeing up space, exiting private browsing, or using a different browser.";

function pickComments(): NightwireComment[] {
  const shuffled = [...NPC_COMMENTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((text) => ({
    id: generateId(),
    author: `citizen_${Math.floor(Math.random() * 9000 + 1000)}`,
    text,
  }));
}

export function useIdentity() {
  const [draft, setDraft, clearDraft, draftFailed] = useLocalStorage<IdentityDraft>(
    DRAFT_KEY,
    EMPTY_DRAFT,
  );
  const [editedImage, setEditedImageRaw, clearEditedImage, editedImageFailed] = useLocalStorage<
    string | null
  >(EDITED_KEY, null);
  const [profile, setProfile, clearProfile, profileFailed] = useLocalStorage<IdentityProfile | null>(
    PROFILE_KEY,
    null,
  );
  const [comments, setComments, clearComments] = useLocalStorage<NightwireComment[]>(
    COMMENTS_KEY,
    [],
  );
  const [recordNumber, setRecordNumber] = useLocalStorage<string>(RECORD_KEY, '');

  const setDraftImage = useCallback(
    (image: string, source: 'preset' | 'upload', presetId: string | null = null) => {
      setDraft({ image, source, presetId });
      clearEditedImage();
    },
    [setDraft, clearEditedImage],
  );

  /**
   * Stores the editor's saved output as the identity's edited image. The
   * image is resized/re-encoded first — this is the single funnel both the
   * panel's manual "Save edit" button and the editor's own onSave callback
   * go through, so every edited image that reaches localStorage is already
   * small, regardless of how large the original upload or editor export was.
   */
  const setEditedImage = useCallback(
    async (image: string) => {
      const processed = await processImageForStorage(image);
      setEditedImageRaw(processed);
    },
    [setEditedImageRaw],
  );

  // Only a saved, edited image counts — the raw preset/upload draft alone
  // is never enough to file or publish. This is what keeps the editor a
  // required step rather than an optional one.
  const activeImage = editedImage;

  const saveProfile = useCallback(
    (values: IdentityFormValues) => {
      if (!editedImage) {
        throw new Error('Save your edited image in the editor before filing.');
      }
      if (!recordNumber) {
        setRecordNumber(generateRecordNumber());
      }
      const next: IdentityProfile = {
        id: profile?.id ?? generateId(),
        alias: values.alias.trim() || 'Unknown',
        role: values.role,
        district: values.district,
        wantedLevel: values.wantedLevel,
        quote: values.quote.trim(),
        image: editedImage,
        createdAt: profile?.createdAt ?? new Date().toISOString(),
        reputation: profile?.reputation ?? Math.floor(Math.random() * 40 + 10),
        views: profile?.views ?? 0,
        likes: profile?.likes ?? 0,
        comments: profile?.comments ?? 0,
        status: profile?.status ?? 'UNCONFIRMED',
      };
      setProfile(next);
      return next;
    },
    [editedImage, profile, recordNumber, setProfile, setRecordNumber],
  );

  const publish = useCallback(() => {
    if (!profile) return null;
    const nextComments = pickComments();
    const published: IdentityProfile = {
      ...profile,
      status: 'CONFIRMED',
      views: profile.views + Math.floor(Math.random() * 1400 + 400),
      likes: profile.likes + Math.floor(Math.random() * 240 + 60),
      comments: nextComments.length,
    };
    setProfile(published);
    setComments(nextComments);
    return published;
  }, [profile, setProfile, setComments]);

  const resetIdentity = useCallback(() => {
    clearDraft();
    clearEditedImage();
    clearProfile();
    clearComments();
  }, [clearDraft, clearEditedImage, clearProfile, clearComments]);

  const storageWarning = draftFailed || editedImageFailed || profileFailed ? STORAGE_WARNING : null;

  return useMemo(
    () => ({
      draft,
      activeImage,
      editedImage,
      profile,
      comments,
      recordNumber: recordNumber || null,
      storageWarning,
      setDraftImage,
      setEditedImage,
      saveProfile,
      publish,
      resetIdentity,
    }),
    [
      draft,
      activeImage,
      editedImage,
      profile,
      comments,
      recordNumber,
      storageWarning,
      setDraftImage,
      setEditedImage,
      saveProfile,
      publish,
      resetIdentity,
    ],
  );
}

