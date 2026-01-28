import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuestionForm } from './QuestionForm';
import type { Question } from '../../types/divination';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (question: Question) => void;
}

export function AskQuestionModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static as="div" className="relative z-50" open={isOpen} onClose={onClose}>
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Dialog.Panel className="mx-auto max-w-lg w-full rounded-2xl bg-white p-8 shadow-2xl">
                <Dialog.Title className="text-2xl font-bold text-gray-900 mb-2">
                  诚心问事，一卦解惑
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mb-6">
                  请写下您心中所惑之事，专注于此念，方得真机。
                </Dialog.Description>

                <QuestionForm onSubmit={onConfirm} onCancel={onClose} />
              </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
