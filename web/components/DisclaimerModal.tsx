/**
 * Legal Disclaimer Modal
 * Shows on first app use - must be accepted to proceed
 */

'use client';

import { useState, useEffect } from 'react';

const DISCLAIMER_ACCEPTED_KEY = 'settlement-game-disclaimer-accepted';
const DISCLAIMER_VERSION = '1.0.0';

export default function DisclaimerModal() {
  const [show, setShow] = useState(false);
  const [understood, setUnderstood] = useState(false);

  useEffect(() => {
    // Check if user has already accepted current version
    const accepted = localStorage.getItem(DISCLAIMER_ACCEPTED_KEY);
    if (accepted !== DISCLAIMER_VERSION) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    if (!understood) return;
    
    localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, DISCLAIMER_VERSION);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
            ⚖️ LEGAL DISCLAIMER
          </h2>
          <p className="text-sm text-gray-600 mt-1">Please read carefully before proceeding</p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <h3 className="font-bold text-yellow-900 mb-2">NOT LEGAL ADVICE</h3>
            <p className="text-yellow-800">
              Settlement Game is a software tool for informational purposes only. 
              <strong> IT DOES NOT PROVIDE LEGAL ADVICE.</strong>
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">You Must:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Consult qualified legal counsel before using any generated documents</li>
              <li>Have both parties obtain independent attorney representation</li>
              <li>Verify all calculations and legal requirements independently</li>
              <li>Have an attorney review documents before filing with any court</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">Limitations:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Wisconsin only:</strong> Based on Wisconsin law as of January 2026</li>
              <li><strong>May be outdated:</strong> Laws change - verify current requirements</li>
              <li><strong>No guarantee:</strong> Calculations may contain errors</li>
              <li><strong>Draft only:</strong> Generates DRAFT documents requiring review</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">Not Suitable For:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>High-conflict divorces</li>
              <li>Cases involving domestic violence</li>
              <li>Situations with hidden assets</li>
              <li>Complex business valuations</li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <h3 className="font-bold text-red-900 mb-2">No Liability</h3>
            <p className="text-red-800 text-xs">
              The authors assume <strong>NO LIABILITY</strong> for any legal consequences, 
              financial losses, or damages resulting from use of this software. Use is 
              entirely at your own risk.
            </p>
          </div>

          <div className="text-xs text-gray-600">
            <p>
              Use of this software does not create an attorney-client relationship. 
              Data is stored locally in your browser.
            </p>
            <p className="mt-2">
              <a 
                href="https://github.com/tbcolby/settlement-game/blob/main/DISCLAIMER.md" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Read full disclaimer →
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm">
              I have read and understood this disclaimer. I acknowledge that this software 
              does not provide legal advice and that I must consult with an attorney before 
              relying on any output.
            </span>
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              disabled={!understood}
              className={`flex-1 py-3 px-4 rounded font-medium ${
                understood
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              I Understand - Continue
            </button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Settlement Game v1.0.0 | By using this software, you accept full responsibility
          </p>
        </div>
      </div>
    </div>
  );
}
