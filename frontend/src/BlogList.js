import React, { useEffect, useState } from "react";
import axios from "axios";

function BlogApp() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState(""); // 新增類別用
  const [categories, setCategories] = useState([]);

  // 取得文章列表
  useEffect(() => {
    axios.get("/api/blogs/")
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error("API 錯誤:", error));
  }, []);

  // 取得類別列表
  useEffect(() => {
    axios.get("/api/categories/")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Category API 錯誤:", error));
  }, []);

  // 新增文章
  const handleSubmit = async (e) => {
    e.preventDefault();
    let categoryId = category ? parseInt(category) : null;

    // 如果有輸入新類別，先建立類別
    if (newCategory.trim() !== "") {
      try {
        const res = await axios.post("/api/categories/", { name: newCategory }, {
          headers: { "Content-Type": "application/json" }
        });
        categoryId = res.data.id; // 取得新類別 ID
        setCategories([...categories, res.data]); // 更新類別列表
        setNewCategory("");
      } catch (error) {
        console.error("新增類別錯誤:", error.response?.data || error);
      }
    }

    // 建立文章 (改成 category_id)
    axios.post("/api/blogs/", {
      title,
      content,
      category_id: categoryId,   // ✅ 改成 category_id
    }, {
      headers: { "Content-Type": "application/json" }
    })
    .then((response) => {
      setBlogs([...blogs, response.data]); // 更新前端列表
      setTitle("");
      setContent("");
      setCategory("");
    })
    .catch((error) => console.error("新增文章錯誤:", error.response?.data || error));
  };

  return (
    <div>
      <h1>部落格文章</h1>

      {/* 新增文章表單 */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>標題：</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>內容：</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>選擇類別：</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">（不選）</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>或新增類別：</label>
          <input 
            type="text" 
            value={newCategory} 
            onChange={(e) => setNewCategory(e.target.value)} 
            placeholder="輸入新類別名稱"
          />
        </div>
        <button type="submit">新增文章</button>
      </form>

      {/* 文章列表 */}
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <h2>{blog.title}</h2>
            <p>{blog.content}</p>
            <small>
              類別: {blog.category ? blog.category.name : "未分類"} | 建立時間: {blog.created_at}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlogApp;
