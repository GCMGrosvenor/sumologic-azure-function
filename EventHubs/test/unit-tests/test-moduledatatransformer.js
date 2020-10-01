/* global describe: false, beforeEach: false, afterEach: false, before: false, after: false, it: false  */
const chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    proxyquire = require('proxyquire');

expect = chai.expect;
chai.use(sinonChai);

describe('moduledatatransformer tests', function() {
    beforeEach(function() {
        const self = this;

        self.loginWithAppServiceMsi = sinon.stub();
        self.getResourceGroups = sinon.stub();
        self.resourceManagementClient = function() {
                return {
                    resourceGroups: {
                        get: self.getResourceGroups
                    }
                }
            };
        self.memoryCache = sinon.stub();

        const subscriptionId = 'test subscription';

        self.sut = proxyquire('../../src/EventHubs_Logs/lib/moduledatatransformer.js',
            {
                '@azure/ms-rest-nodeauth': {
                    'loginWithAppServiceMSI': self.loginWithAppServiceMsi
                },
                '@azure/arm-resources': {
                    'ResourceManagementClient': self.resourceManagementClient
                },
                'adal-node': {
                    'MemoryCache': self.memoryCache
                }
            })(subscriptionId);
    });

    describe('when transform is called', function () {
        describe('once with a resource group having a module tag', function () {
            beforeEach(async function() {
                const self = this;
                self.getResourceGroups.resolves({ resourceGroupName: 'abc', tags: { module: 'moduleAbc' } });
                const msg = { resourceGroupName: 'abc' };
                self.result = await this.sut.transform(msg);
            });

            it('returns the module tag of the resource group', function() {
                expect(this.result.assetmodule).to.equal('moduleAbc');
            });

            it('calls getResourceGroups once', function () {
                expect(this.getResourceGroups).to.have.been.calledOnce;
            });
        });

        describe('multiple times with a resource group having a module tag', async function () {
            beforeEach(async function() {
                const self = this;
                self.getResourceGroups.resolves({ resourceGroupName: 'abc', tags: { module: 'moduleAbc' } });
                const msg = { resourceGroupName: 'abc' };
                self.results = [
                    await this.sut.transform(msg), await this.sut.transform(msg), await this.sut.transform(msg)
                ];
            });

            it('returns the module tag of the resource group in each call',
                function() {
                    expect(this.results[0].assetmodule).to.equal('moduleAbc');
                    expect(this.results[1].assetmodule).to.equal('moduleAbc');
                    expect(this.results[2].assetmodule).to.equal('moduleAbc');
                });

            it('calls getResourceGroups once',
                function() {
                    expect(this.getResourceGroups).to.have.been.calledOnce;
                });
            });
        });

    describe('once with a resource group not a module tag', async function () {
        beforeEach(async function () {
            const self = this;
            self.getResourceGroups.resolves({ resourceGroupName: 'abc', tags: { } });
            const msg = { resourceGroupName: 'abc' };
            self.result = await this.sut.transform(msg);
        });

        it('returns the module tag of the resource group', function () {
            expect(this.result.assetmodule).to.be.undefined;
        });

        it('calls getResourceGroups once', function () {
            expect(this.getResourceGroups).to.have.been.calledOnce;
        });
    });

    describe('once with a resource group that does not exist', async function () {
        beforeEach(async function () {
            const self = this;
            self.getResourceGroups.resolves({ resourceGroupName: 'abc', tags: {} });
            const msg = { resourceGroupName: 'abc' };
            self.result = await this.sut.transform(msg);
        });

        it('returns the module tag of the resource group', function () {
            expect(this.result.assetmodule).to.be.undefined;
        });

        it('calls getResourceGroups once', function () {
            expect(this.getResourceGroups).to.have.been.calledOnce;
        });
    });

    describe('once with a message without a resource group name', async function () {
        beforeEach(async function () {
            const self = this;
            const msg = { };
            self.result = await this.sut.transform(msg);
        });

        it('returns the module tag of the resource group', function () {
            expect(this.result.assetmodule).to.be.undefined;
        });

        it('calls getResourceGroups once', function () {
            expect(this.getResourceGroups).to.not.have.been.called;
        });
    });

    describe('once with a null message', async function () {
        beforeEach(async function () {
            const self = this;
            const msg = null;
            self.result = await this.sut.transform(msg);
        });

        it('returns the module tag of the resource group', function () {
            expect(this.result).to.be.null;
        });

        it('calls getResourceGroups once', function () {
            expect(this.getResourceGroups).to.not.have.been.called;
        });
    });

    describe('once with an undefined message', async function () {
        beforeEach(async function () {
            const self = this;
            const msg = undefined;
            self.result = await this.sut.transform(msg);
        });

        it('returns the module tag of the resource group', function () {
            expect(this.result).to.be.undefined;
        });

        it('calls getResourceGroups once', function () {
            expect(this.getResourceGroups).to.not.have.been.called;
        });
    });
});