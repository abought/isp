import Ember from 'ember';

import {moduleForComponent, test} from 'ember-qunit';

import sinon from 'sinon';

import hbs from 'htmlbars-inline-precompile';

const toastStub = Ember.Service.extend({
    //error: () => assert.ok(true, 'Toast error method was called')  // jshint ignore:line
});

// The component doesn't actually have a template, so generate one that can be used to trigger actions
const BasicTemplate = hbs`<button id="save-frame" {{action 'saveHandler'}}>Save</button>
  <button id="go-next" {{action 'next'}}>Next</button>`;

moduleForComponent('exp-frame-base', 'Integration | Component | exp frame base', {
    integration: true,

    beforeEach() {
        this.register('service:toast', toastStub);
        // Give the base frame a temporary template
        this.register('template:components/exp-frame-base', BasicTemplate);
    }
});

test('it shows an error when it encounters an adapter 400 error', function (assert) {
    // Expects the error method to be called on toast service
    assert.expect(3);

    const nextAction = sinon.spy();
    this.on('nextAction', nextAction);


    const saveHandler = sinon.spy(() => {
        //assert.ok(true, 'Save frame method was called');
        return Ember.RSVP.reject(new DS.InvalidError());
    });
    //
    this.on('saveFrame', saveHandler);

    this.render(
        hbs`{{exp-frame-base
                next=(action 'nextAction')
                saveHandler=(action 'saveFrame')
            }}`);

    // Logic: click next button. Save should be called but the passed-in next action should not.

    // We expect that a warning was displayed to the user, and the next action was circumvented
    // TODO: Figure out a way to test that toast.warning was called
    console.log('nextAction.calledOnce', nextAction.calledOnce);


    this.$('#go-next').click();
    assert.ok(saveHandler.calledOnce, 'Clicking next button should attempt to save the frame');
    assert.notOk(nextAction.calledOnce, 'When save fails, the passed-in next action should not be called');
});

//
// test('it shows an error when it encounters some generic adapter error', function (assert) {
//
//     // Set any properties with this.set('myProperty', 'value');
//     // Handle any actions with this.on('myAction', function(val) { ... });
//
//     const nextAction = sinon.spy();
//     const saveFrame = () => Ember.RSVP.reject(new DS.InvalidError);
//
//     this.set('next', nextAction);
//     this.set('saveFrame', saveFrame);
//
//     this.render(
//         hbs`{{exp-frame-base
//                 next=(action 'next')
//                 saveHandler=(action 'saveFrame')
//             }}`);
//
//     // We expect that a warning was displayed to the user, and the next action was circumvented
//     assert.notOk(nextAction.calledOnce);
// });
