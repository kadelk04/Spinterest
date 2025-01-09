import { Request, Response } from 'express';
import {
  updateProfilePgInfo,
  getProfilePgInfo,
  toggleVisibility,
} from '../../src/controllers/profileController';
import { getModel } from '../../src/utils/connection';

// Use `FavoritesM` wherever needed in your controller logic

// Mock the getModel utility
jest.mock('../../src/utils/connection', () => ({
  getModel: jest.fn(),
}));

describe('Profile Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSend: jest.Mock;

  beforeEach(() => {
    // Reset mocks before each test
    mockJson = jest.fn();
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnValue({
      json: mockJson,
      send: mockSend,
    });

    mockResponse = {
      status: mockStatus,
      json: mockJson,
      send: mockSend,
    };

    // Reset the mocked getModel
    (getModel as jest.Mock).mockClear();
  });

  describe('updateProfilePgInfo', () => {
    it('should return 404 if user not found', async () => {
      const mockUserModel = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const mockFavoritesModel = {
        findOne: jest.fn(),
      };

      (getModel as jest.Mock)
        .mockReturnValueOnce(mockUserModel)
        .mockReturnValueOnce(mockFavoritesModel);

      mockRequest = {
        body: {
          username: 'nonexistentuser',
        },
      };

      await updateProfilePgInfo(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockSend).toHaveBeenCalledWith('User not found');
    });

    it('should handle errors during profile update', async () => {
      const mockUserModel = {
        findOne: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      (getModel as jest.Mock).mockReturnValue(mockUserModel);

      mockRequest = {
        body: {
          username: 'testuser',
        },
      };

      await updateProfilePgInfo(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error processing profile input',
      });
    });
  });

  test('getModel should return the correct model', () => {
    const UserModel = getModel('User');
    const FavoritesModel = getModel('Favorites');

    expect(UserModel).toBeDefined();
    expect(FavoritesModel).toBeDefined();
  });

  describe('getProfilePgInfo', () => {
    it('should retrieve profile information successfully', async () => {
      const mockUser = {
        status: 'Active',
        location: 'New York',
        links: 'example.com',
        bio: 'Test biography',
        favoritesId: {
          genre: ['Rock', 'Jazz'],
          artist: ['Artist1', 'Artist2'],
          album: ['Album1', 'Album2'],
        },
      };

      const mockUserModel = {
        findOne: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(mockUser),
      };

      (getModel as jest.Mock).mockReturnValue(mockUserModel);

      mockRequest = {
        query: {
          username: 'testuser',
        },
      };

      await getProfilePgInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        status: 'Active',
        location: 'New York',
        links: 'example.com',
        biography: 'Test biography',
        favorites: {
          genre: ['Rock', 'Jazz'],
          artist: ['Artist1', 'Artist2'],
          album: ['Album1', 'Album2'],
        },
      });
    });

    it('should return 404 if user not found', async () => {
      const mockUserModel = {
        findOne: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue(null),
      };

      (getModel as jest.Mock).mockReturnValue(mockUserModel);

      mockRequest = {
        query: {
          username: 'nonexistentuser',
        },
      };

      await getProfilePgInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockSend).toHaveBeenCalledWith('User not found');
    });

    it('should handle errors during profile retrieval', async () => {
      const mockUserModel = {
        findOne: jest.fn().mockReturnThis(),
        populate: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      (getModel as jest.Mock).mockReturnValue(mockUserModel);

      mockRequest = {
        query: {
          username: 'testuser',
        },
      };

      await getProfilePgInfo(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error fetching profile input',
      });
    });
  });

  describe('toggleVisibility', () => {
    it('should return 404 if user not found', async () => {
      const mockUserModel = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      (getModel as jest.Mock).mockReturnValue(mockUserModel);

      mockRequest = {
        body: {
          username: 'nonexistentuser',
        },
      };

      await toggleVisibility(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockSend).toHaveBeenCalledWith('User not found');
    });
    it('should handle errors during visibility toggle', async () => {
      const mockUserModel = {
        findOne: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      (getModel as jest.Mock).mockReturnValue(mockUserModel);

      mockRequest = {
        body: {
          username: 'testuser',
        },
      };

      await toggleVisibility(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Error toggling visibility',
      });
    });
    it('should toggle visibility successfully', async () => {
      const mockUser = {
        visibility: true,
        save: jest.fn(),
      };

      const mockUserModel = {
        findOne: jest.fn().mockResolvedValue(mockUser),
      };
      (getModel as jest.Mock).mockReturnValue(mockUserModel);

      mockRequest = {
        body: {
          username: 'testuser',
        },
      };

      await toggleVisibility(mockRequest as Request, mockResponse as Response);

      expect(mockUser.visibility).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
    });
  });
});
