import Ember from 'ember';

import {moduleForComponent, test} from 'ember-qunit';

import sinon from 'sinon';

import hbs from 'htmlbars-inline-precompile';

moduleForComponent('exp-frame-base', 'Integration | Component | exp frame base', {
    integration: true
});

test('it shows an error when it encounters an adapter 400 error', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    const nextAction = sinon.spy();
    const saveFrame = () => Ember.RSVP.reject(new DS.InvalidError());

    this.set('next', nextAction);
    this.set('saveFrame', saveFrame);

    this.render(
        hbs`{{exp-frame-base 
                next=next
                saveHandler=saveFrame
            }}`);

    // We expect that a warning was displayed to the user, and the next action was circumvented
    // TODO: Figure out a way to test that toast.warning was called
    assert.notOk(nextAction.calledOnce);
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
