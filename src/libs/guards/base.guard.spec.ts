import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { BaseGuard } from './base.guard';
import { RoleType } from './role-type.enum';
import { Reflector } from '@nestjs/core';

class TestHelperGuard extends BaseGuard {
    constructor(reflector: Reflector) {
        super(reflector);
    }

    canActivate(context: ExecutionContext): Promise<boolean> | boolean {
        return true;
    }
}

describe('BaseGuard', () => {
    let guard: BaseGuard;
    let reflectorMock: jest.Mocked<Reflector>;

    beforeEach(() => {
        reflectorMock = {
            get: jest.fn(),
        } as unknown as jest.Mocked<Reflector>;

        guard = new TestHelperGuard(reflectorMock);
    });

    describe('handleRoute', () => {
        it('should throw UnauthorizedException when roles are not defined', () => {
            const contextMock = {
                getHandler: jest.fn(),
            } as unknown as ExecutionContext;
            const roleType = RoleType.MANAGER;

            reflectorMock.get.mockReturnValueOnce(undefined);

            expect(() => guard.handleRoute(contextMock, roleType)).toThrow(UnauthorizedException);
            expect(reflectorMock.get).toHaveBeenCalledWith('role', contextMock.getHandler());
        });

        it('should return true when the provided roleType is included in the roles array', () => {
            const contextMock = {
                getHandler: jest.fn(),
            } as unknown as ExecutionContext;
            const roleType = RoleType.MANAGER;

            reflectorMock.get.mockReturnValueOnce(['manager', 'technician']);

            const result = guard.handleRoute(contextMock, roleType);

            expect(result).toBe(true);
            expect(reflectorMock.get).toHaveBeenCalledWith('role', contextMock.getHandler());
        });

        it('should return false when the provided roleType is not included in the roles array', () => {
            const contextMock = {
                getHandler: jest.fn(),
            } as unknown as ExecutionContext;
            const roleType = RoleType.TECHNICIAN;

            reflectorMock.get.mockReturnValueOnce(['manager', 'admin']);

            const result = guard.handleRoute(contextMock, roleType);

            expect(result).toBe(false);
            expect(reflectorMock.get).toHaveBeenCalledWith('role', contextMock.getHandler());
        });
    });
});
