import { Request, Response } from 'express';
import {
  updateProfilePgInfo,
  getProfilePgInfo,
  getPinnedPlaylists,
  pinPlaylist,
  cleanupPinnedPlaylists
} from '../../src/controllers/profileController';
import { getModel } from '../../src/utils/connection';
import axios from 'axios';

// Use `FavoritesM` wherever needed in your controller logic

// Mock the getModel utility
jest.mock('../../src/utils/connection', () => ({
  getModel: jest.fn(),
}));

jest.mock('axios');

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

  describe('Pinned Playlist Functions', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockSend: jest.Mock;
  
    beforeEach(() => {
      jest.clearAllMocks(); // clear all mocks
  
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
    });
  
    describe('Pinned Playlist Functions', () => {
      let mockRequest: Partial<Request>;
      let mockResponse: Partial<Response>;
      let mockJson: jest.Mock;
      let mockStatus: jest.Mock;
      let mockSend: jest.Mock;
    
      beforeEach(() => {
        jest.clearAllMocks(); // Clear all mocks
    
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
      });
    
      describe('pinPlaylist', () => {
        it('should return 404 if user is not found', async () => {
          // For pinPlaylist, controller calls findOne().populate(...).
          // We simulate a chainable query that resolves to null.
          const mockQuery = {
            populate: jest.fn().mockResolvedValue(null),
          };
          const mockUserModel = {
            findOne: jest.fn().mockReturnValue(mockQuery),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          mockRequest = {
            params: { username: 'nonexistent', playlistId: 'playlist1' },
          };
    
          await pinPlaylist(mockRequest as Request, mockResponse as Response);
    
          // Expect a 404 since user was not found.
          expect(mockStatus).toHaveBeenCalledWith(404);
          expect(mockSend).toHaveBeenCalledWith('User not found');
        });
    
        it('should unpin a playlist if it is already pinned', async () => {
          // Simulate a user returned via chainable query.
          const user = {
            pinnedPlaylists: ['playlist1', 'playlist2'],
            save: jest.fn().mockResolvedValue(true),
          };
          const mockQuery = {
            populate: jest.fn().mockResolvedValue(user),
          };
          const mockUserModel = {
            findOne: jest.fn().mockReturnValue(mockQuery),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          mockRequest = {
            params: { username: 'testuser', playlistId: 'playlist1' },
          };
    
          await pinPlaylist(mockRequest as Request, mockResponse as Response);
    
          // Expect playlist1 to be removed from pinnedPlaylists.
          expect(user.save).toHaveBeenCalled();
          expect(user.pinnedPlaylists).toEqual(['playlist2']);
          expect(mockStatus).toHaveBeenCalledWith(200);
          expect(mockSend).toHaveBeenCalledWith({
            message: 'Pin status updated',
            pinnedPlaylists: user.pinnedPlaylists,
          });
        });
    
        it('should pin a playlist if it is not already pinned', async () => {
          // Simulate a user returned via chainable query.
          const user = {
            pinnedPlaylists: ['playlist2'],
            save: jest.fn().mockResolvedValue(true),
          };
          const mockQuery = {
            populate: jest.fn().mockResolvedValue(user),
          };
          const mockUserModel = {
            findOne: jest.fn().mockReturnValue(mockQuery),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          mockRequest = {
            params: { username: 'testuser', playlistId: 'playlist3' },
          };
    
          await pinPlaylist(mockRequest as Request, mockResponse as Response);
    
          // Expect playlist3 to be added to pinnedPlaylists.
          expect(user.save).toHaveBeenCalled();
          expect(user.pinnedPlaylists).toEqual(['playlist2', 'playlist3']);
          expect(mockStatus).toHaveBeenCalledWith(200);
          expect(mockSend).toHaveBeenCalledWith({
            message: 'Pin status updated',
            pinnedPlaylists: user.pinnedPlaylists,
          });
        });
      });
    
      describe('getPinnedPlaylists', () => {
        it('should return 400 if username is missing', async () => {
          // getPinnedPlaylists does not call populate.
          mockRequest = {
            params: {},
          };
    
          await getPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          expect(mockStatus).toHaveBeenCalledWith(400);
          expect(mockSend).toHaveBeenCalledWith('User not found');
        });
    
        it('should return 404 if no pinned playlists are found', async () => {
          // Directly resolve to a user with an empty pinnedPlaylists array.
          const user = { pinnedPlaylists: [] };
          const mockUserModel = {
            findOne: jest.fn().mockResolvedValue(user),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          mockRequest = {
            params: { username: 'testuser' },
          };
    
          await getPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          expect(mockStatus).toHaveBeenCalledWith(404);
          expect(mockSend).toHaveBeenCalledWith('No pinned playlists found');
        });
    
        it('should return pinned playlists successfully', async () => {
          // Directly resolve to a user with some pinnedPlaylists.
          const user = { pinnedPlaylists: ['playlist1', 'playlist2'] };
          const mockUserModel = {
            findOne: jest.fn().mockResolvedValue(user),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          mockRequest = {
            params: { username: 'testuser' },
          };
    
          await getPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          expect(mockStatus).toHaveBeenCalledWith(200);
          expect(mockSend).toHaveBeenCalledWith({
            message: 'Pinned playlists retrieved successfully',
            pinnedPlaylists: user.pinnedPlaylists,
          });
        });
      });
    
      describe('cleanupPinnedPlaylists', () => {
        it('should return 400 if username or access token is missing', async () => {
          mockRequest = {
            params: {},
            headers: {},
          };
    
          await cleanupPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          expect(mockStatus).toHaveBeenCalledWith(400);
          expect(mockJson).toHaveBeenCalledWith({
            success: false,
            message: 'Missing username or access token',
            removed: []
          });
        });
    
        it('should return 404 if user is not found', async () => {
          // For cleanupPinnedPlaylists, findOne is called without populate.
          const mockUserModel = {
            findOne: jest.fn().mockResolvedValue(null),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          mockRequest = {
            params: { username: 'nonexistent' },
            headers: { authorization: 'Bearer validtoken' },
          };
    
          await cleanupPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          expect(mockStatus).toHaveBeenCalledWith(404);
          expect(mockJson).toHaveBeenCalledWith({
            success: false,
            message: 'User not found',
            removed: []
          });
        });
    
        it('should return a message if no pinned playlists exist', async () => {
          const userNoPinned = { _id: 'user123', pinnedPlaylists: [] };
          const mockUserModel = {
            findOne: jest.fn().mockResolvedValue(userNoPinned),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          mockRequest = {
            params: { username: 'testuser' },
            headers: { authorization: 'Bearer validtoken' },
          };
    
          await cleanupPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          expect(mockStatus).toHaveBeenCalledWith(200);
          expect(mockJson).toHaveBeenCalledWith({
            success: true,
            message: 'No pinned playlists to clean up',
            removed: []
          });
        });
    
        it('should cleanup unavailable pinned playlists', async () => {
          // For cleanupPinnedPlaylists, resolve directly to a user.
          const userWithPinned = {
            _id: 'user123',
            pinnedPlaylists: ['playlist1', 'playlist2', 'playlist3'],
            save: jest.fn().mockResolvedValue(true),
          };
          const mockUserModel = {
            findOne: jest.fn().mockResolvedValue(userWithPinned),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          // Simulate Spotify API responses:
          // First axios.get call returns the Spotify user id.
          (axios.get as jest.Mock)
            .mockResolvedValueOnce({ data: { id: 'spotifyUser123' } })
            // Second axios.get call returns Spotify playlists, only including 'playlist1'.
            .mockResolvedValueOnce({
              data: {
                items: [{ id: 'playlist1', name: 'Playlist One' }],
                next: null,
              },
            });
    
          mockRequest = {
            params: { username: 'testuser' },
            headers: { authorization: 'Bearer validtoken' },
          };
    
          await cleanupPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          // Expect that playlists not returned by Spotify (playlist2 and playlist3) are removed.
          expect(userWithPinned.save).toHaveBeenCalled();
          expect(mockStatus).toHaveBeenCalledWith(200);
          expect(mockJson).toHaveBeenCalledWith({
            success: true,
            message: 'Removed 2 unavailable playlists',
            removed: ['playlist2', 'playlist3']
          });
        });
    
        it('should return valid message when all pinned playlists are still available', async () => {
          const userWithAllValid = {
            _id: 'user123',
            pinnedPlaylists: ['playlist1', 'playlist2'],
            save: jest.fn().mockResolvedValue(true),
          };
          const mockUserModel = {
            findOne: jest.fn().mockResolvedValue(userWithAllValid),
          };
          (getModel as jest.Mock).mockReturnValue(mockUserModel);
    
          (axios.get as jest.Mock)
            .mockResolvedValueOnce({ data: { id: 'spotifyUser123' } })
            .mockResolvedValueOnce({
              data: {
                items: [
                  { id: 'playlist1', name: 'Playlist One' },
                  { id: 'playlist2', name: 'Playlist Two' }
                ],
                next: null,
              },
            });
    
          mockRequest = {
            params: { username: 'testuser' },
            headers: { authorization: 'Bearer validtoken' },
          };
    
          await cleanupPinnedPlaylists(mockRequest as Request, mockResponse as Response);
    
          expect(mockStatus).toHaveBeenCalledWith(200);
          expect(mockJson).toHaveBeenCalledWith({
            success: true,
            message: 'All pinned playlists are still valid',
            removed: []
          });
        });
      });
    });
  });
});