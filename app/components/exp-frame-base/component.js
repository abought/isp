import Ember from 'ember';
import DS from 'ember-data';

import ExpFrameBase from 'exp-player/components/exp-frame-base/component';

/**
 * Custom version of frame base that allows ISP (but no other platform app) to provide special handling of
 *   errors on save. Mostly targeted at 400 & 500 errors- where problem is a save failure not associated with auth.
 *   (Assumption: 401 and 403 errors will be handled by DataAdapterMixin before they reach this level)
 *
 * This might be useful to the generic platform, but putting it in ISP for the moment lets us reduce QA burden for
 *   turnaround on a critical bug
 */
export default ExpFrameBase.extend({
    toast: Ember.inject.service(),
    i18n: Ember.inject.service(),

    _save() {
        var frameId = `${this.get('frameIndex')}-${this.get('id')}`;
        // When exiting frame, save the data to the base player using the provided saveHandler
        const payload = this.serializeContent();
        return this.attrs.saveHandler(frameId, payload);
    },

    displayError(error) {
        if (error instanceof DS.AdapterError) {
            // If the save failure was a server error, warn the user TODO: Improve the error message
            const msg = this.get('i18n').t('previousLogin.line2').string;
            this.get('toast').error(msg);
        } else {
            // If this is not an error we intend to handle, reraise it (we except that adapters will handle 401 and
            //   403 internally by redirecting to the login page)
            throw error;
        }
    },

    actions: {
        save() {
            this._save().catch(err => this.displayError(err));
        },

        next() {
            this.send('setTimeEvent', 'nextFrame');

            // Only advance the form if save succeeded
            this._save()
                .then(() => this.sendAction('next'))
                .catch(err => this.displayError(err));
            window.scrollTo(0, 0);
        }
    }

});
