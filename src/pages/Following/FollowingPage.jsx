import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API, { BASE_URL } from '../../Configs/ApiEndpoints';

export default function FollowingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sellers'); // 'sellers' or 'teachers'
  const [sellerFollowing, setSellerFollowing] = useState([]);
  const [teacherFollowing, setTeacherFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch both sellers and teachers on mount
  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch sellers
      const sellerResponse = await fetch(API.GET_USER_FOLLOWING, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const sellerData = await sellerResponse.json();

      if (sellerData.status === 'success') {
        const transformedSellers = sellerData.following.map(seller => ({
          id: seller.seller_id,
          name: seller.store_name,
          bio: seller.store_description || 'Seller at CultureConnect',
          category: seller.category || 'Products',
          avatar: `${BASE_URL}/seller_img_datas/seller_logos/${seller.store_logo}`,
          followers: seller.followers || 0,
          isFollowing: seller.is_following
        }));
        setSellerFollowing(transformedSellers);
      }

      // Fetch teachers
      const teacherResponse = await fetch(API.GET_USER_FOLLOWING_TEACHERS, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const teacherData = await teacherResponse.json();

      if (teacherData.status === 'success') {
        const transformedTeachers = teacherData.following.map(teacher => ({
          id: teacher.teacher_id,
          name: teacher.name,
          bio: teacher.bio || 'Teacher at CultureConnect',
          category: teacher.category || 'General',
          avatar: teacher.profile_picture
            ? `${API.TEACHER_PROFILE_PICTURES}/${teacher.profile_picture}`
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`,
          followers: teacher.followers || 0,
          isFollowing: true
        }));
        setTeacherFollowing(transformedTeachers);
      }

    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching following:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSellerUnfollow = async (id) => {
    try {
      const formData = new FormData();
      formData.append('seller_id', id);
      formData.append('action', 'unfollow');

      const response = await fetch(API.FOLLOW_SELLER, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSellerFollowing(sellerFollowing.map(user =>
          user.id === id ? {
            ...user,
            isFollowing: false,
            followers: data.followers_count || user.followers - 1
          } : user
        ));
      } else {
        alert(data.message || 'Failed to unfollow');
      }
    } catch (err) {
      console.error('Error unfollowing seller:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleSellerFollow = async (id) => {
    try {
      const formData = new FormData();
      formData.append('seller_id', id);
      formData.append('action', 'follow');

      const response = await fetch(API.FOLLOW_SELLER, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSellerFollowing(sellerFollowing.map(user =>
          user.id === id ? {
            ...user,
            isFollowing: true,
            followers: data.followers_count || user.followers + 1
          } : user
        ));
      } else {
        alert(data.message || 'Failed to follow');
      }
    } catch (err) {
      console.error('Error following seller:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleTeacherUnfollow = async (id) => {
    try {
      const formData = new FormData();
      formData.append('teacher_id', id);
      formData.append('action', 'unfollow');

      const response = await fetch(API.FOLLOW_TEACHER, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setTeacherFollowing(teacherFollowing.map(teacher =>
          teacher.id === id ? {
            ...teacher,
            isFollowing: false,
            followers: data.followers_count || teacher.followers - 1
          } : teacher
        ));
      } else {
        alert(data.message || 'Failed to unfollow');
      }
    } catch (err) {
      console.error('Error unfollowing teacher:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleTeacherFollow = async (id) => {
    try {
      const formData = new FormData();
      formData.append('teacher_id', id);
      formData.append('action', 'follow');

      const response = await fetch(API.FOLLOW_TEACHER, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setTeacherFollowing(teacherFollowing.map(teacher =>
          teacher.id === id ? {
            ...teacher,
            isFollowing: true,
            followers: data.followers_count || teacher.followers + 1
          } : teacher
        ));
      } else {
        alert(data.message || 'Failed to follow');
      }
    } catch (err) {
      console.error('Error following teacher:', err);
      alert('Network error. Please try again.');
    }
  };

  const currentFollowing = activeTab === 'sellers' ? sellerFollowing : teacherFollowing;
  const followingCount = activeTab === 'sellers'
    ? sellerFollowing.filter(u => u.isFollowing).length
    : teacherFollowing.filter(t => t.isFollowing).length;

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-xl font-semibold text-black">Following</h1>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto flex border-t border-gray-300">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex-1 py-3 text-center font-semibold transition ${activeTab === 'sellers'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
              }`}
          >
            Sellers ({sellerFollowing.length})
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex-1 py-3 text-center font-semibold transition ${activeTab === 'teachers'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-black'
              }`}
          >
            Teachers ({teacherFollowing.length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchFollowing}
            className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Following List */}
      {!loading && !error && (
        <>
          <div className="max-w-2xl mx-auto">
            {currentFollowing.length === 0 ? (
              <div className="bg-white px-4 py-12 text-center">
                <p className="text-gray-600">
                  You're not following any {activeTab === 'sellers' ? 'sellers' : 'teachers'} yet
                </p>
              </div>
            ) : (
              <>
                {/* Sellers View */}
                {activeTab === 'sellers' && sellerFollowing.map(seller => (
                  <div
                    key={seller.id}
                    className="bg-white border-b border-gray-300 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/sellerprofile/${seller.id}`, { replace: true })}
                      >
                        <img
                          src={seller.avatar}
                          alt={seller.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seller.name}`;
                          }}
                        />
                      </div>

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/sellerprofile/${seller.id}`, { replace: true })}
                      >
                        <h3 className="font-semibold text-black text-sm mb-0.5">
                          {seller.name}
                        </h3>
                        <p className="text-gray-600 text-xs mb-1.5 line-clamp-1">
                          {seller.bio}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {seller.followers}
                          </span>

                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {seller.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {seller.isFollowing ? (
                          <button
                            onClick={() => handleSellerUnfollow(seller.id)}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1.5 px-5 rounded-lg text-sm transition"
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSellerFollow(seller.id)}
                            className="bg-black hover:bg-gray-800 text-white font-semibold py-1.5 px-5 rounded-lg text-sm transition"
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Teachers View */}
                {activeTab === 'teachers' && teacherFollowing.map(teacher => (
                  <div
                    key={teacher.id}
                    className="bg-white border-b border-gray-300 px-4 py-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/teacherprofile/${teacher.id}`, { replace: true })}
                      >
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`;
                          }}
                        />
                      </div>

                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/teacherprofile/${teacher.id}`, { replace: true })}
                      >
                        <h3 className="font-semibold text-black text-sm mb-0.5">
                          {teacher.name}
                        </h3>
                        <p className="text-gray-600 text-xs mb-1.5 line-clamp-1">
                          {teacher.bio}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {teacher.followers}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {teacher.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {teacher.isFollowing ? (
                          <button
                            onClick={() => handleTeacherUnfollow(teacher.id)}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-1.5 px-5 rounded-lg text-sm transition"
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTeacherFollow(teacher.id)}
                            className="bg-black hover:bg-gray-800 text-white font-semibold py-1.5 px-5 rounded-lg text-sm transition"
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Info */}
          {currentFollowing.length > 0 && (
            <div className="max-w-2xl mx-auto px-4 py-6 text-center">
              <p className="text-gray-500 text-sm">
                You're following {followingCount} {activeTab === 'sellers'
                  ? (followingCount === 1 ? 'seller' : 'sellers')
                  : (followingCount === 1 ? 'teacher' : 'teachers')
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}