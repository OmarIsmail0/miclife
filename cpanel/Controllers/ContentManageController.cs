using micpanel.ModelDto;
using micpanel.ModelDto.Enums;
using micpanel.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace micpanel.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize(Roles = "admin,marketing")]
	public class ContentManageController : ControllerBase
	{
		private readonly IContentManage _contentManage;

		public ContentManageController(IContentManage contentManage)
		{
			_contentManage = contentManage;
		}

		#region LOB Endpoints

		[HttpPost("lob/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllLOBs([FromBody] LOBFilterModel? filter = null)
		{
			try
			{
				filter ??= new LOBFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var lobs = await _contentManage.GetAllLOBsAsync(filter);
				return Ok(lobs);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("lob/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetLOBById(int id)
		{
			try
			{
				var lob = await _contentManage.GetLOBByIdAsync(id);

				if (lob == null)
					return NotFound(new { Message = "LOB not found" });

				return Ok(lob);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("lob/slug/{slug}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetLOBBySlug(string slug)
		{
			try
			{
				var lob = await _contentManage.GetLOBBySlugAsync(slug);

				if (lob == null)
					return NotFound(new { Message = "LOB not found" });

				return Ok(lob);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("lob/create")]
		public async Task<IActionResult> CreateLOB([FromBody] CreateLOBModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var lob = await _contentManage.CreateLOBAsync(model);
				return Ok(new { Message = "LOB created successfully", Data = lob });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("lob/update")]
		public async Task<IActionResult> UpdateLOB([FromBody] UpdateLOBModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var lob = await _contentManage.UpdateLOBAsync(model);
				return Ok(new { Message = "LOB updated successfully", Data = lob });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("lob/{id}")]
		public async Task<IActionResult> DeleteLOB(int id)
		{
			try
			{
				var result = await _contentManage.DeleteLOBAsync(id);

				if (!result)
					return NotFound(new { Message = "LOB not found" });

				return Ok(new { Message = "LOB deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("lob/{id}/toggle-status")]
		public async Task<IActionResult> ToggleLOBStatus(int id, [FromBody] bool isActive)
		{
			try
			{
				var result = await _contentManage.ToggleLOBStatusAsync(id, isActive);

				if (!result)
					return NotFound(new { Message = "LOB not found" });

				return Ok(new { Message = $"LOB status changed to {(isActive ? "Active" : "Inactive")}" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Section Endpoints

		[HttpPost("section/getall")]
		[Authorize(Roles = "admin")] // Only admin role can access this endpoint
		public async Task<IActionResult> GetAllSections([FromBody] SectionFilterModel? filter = null)
		{
			try
			{
				filter ??= new SectionFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var sections = await _contentManage.GetAllSectionsAsync(filter);
				return Ok(sections);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("section/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetSectionById(int id)
		{
			try
			{
				var section = await _contentManage.GetSectionByIdAsync(id);

				if (section == null)
					return NotFound(new { Message = "Section not found" });

				return Ok(section);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("section/key/{key}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetSectionByKey(string key)
		{
			try
			{
				var section = await _contentManage.GetSectionByKeyAsync(key);

				if (section == null)
					return NotFound(new { Message = "Section not found" });

				return Ok(section);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("section/slug/{slug}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetSectionBySlug(string slug)
		{
			try
			{
				var section = await _contentManage.GetSectionBySlugAsync(slug);

				if (section == null)
					return NotFound(new { Message = "Section not found" });

				return Ok(section);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("section/create")]
		[Authorize(Roles = "admin")]
		public async Task<IActionResult> CreateSection([FromBody] CreateSectionModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var section = await _contentManage.CreateSectionAsync(model);
				return Ok(new { Message = "Section created successfully", Data = section });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("section/update")]
		[Authorize(Roles = "admin")]
		public async Task<IActionResult> UpdateSection([FromBody] UpdateSectionModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var section = await _contentManage.UpdateSectionAsync(model);
				return Ok(new { Message = "Section updated successfully", Data = section });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("section/{id}")]
		[Authorize(Roles = "admin")]
		public async Task<IActionResult> DeleteSection(int id)
		{
			try
			{
				var result = await _contentManage.DeleteSectionAsync(id);

				if (!result)
					return NotFound(new { Message = "Section not found" });

				return Ok(new { Message = "Section deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("section/{id}/toggle-status")]
		[Authorize(Roles = "admin")]
		public async Task<IActionResult> ToggleSectionStatus(int id, [FromBody] bool isActive)
		{
			try
			{
				var result = await _contentManage.ToggleSectionStatusAsync(id, isActive);

				if (!result)
					return NotFound(new { Message = "Section not found" });

				return Ok(new { Message = $"Section status changed to {(isActive ? "Active" : "Inactive")}" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Product Endpoints

		[HttpPost("product/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllProducts([FromBody] ProductFilterModel? filter = null)
		{
			try
			{
				filter ??= new ProductFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var products = await _contentManage.GetAllProductsAsync(filter);
				return Ok(products);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("product/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetProductById(int id)
		{
			try
			{
				var product = await _contentManage.GetProductByIdAsync(id);

				if (product == null)
					return NotFound(new { Message = "Product not found" });

				return Ok(product);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("product/slug/{slug}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetProductBySlug(string slug)
		{
			try
			{
				var product = await _contentManage.GetProductBySlugAsync(slug);

				if (product == null)
					return NotFound(new { Message = "Product not found" });

				return Ok(product);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("product/lob/{lobId}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetProductsByLOB(int lobId)
		{
			try
			{
				var products = await _contentManage.GetProductsByLOBAsync(lobId);
				return Ok(products);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("product/create")]
		public async Task<IActionResult> CreateProduct([FromBody] CreateProductModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var product = await _contentManage.CreateProductAsync(model);
				return Ok(new { Message = "Product created successfully", Data = product });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("product/update")]
		public async Task<IActionResult> UpdateProduct([FromBody] UpdateProductModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var product = await _contentManage.UpdateProductAsync(model);
				return Ok(new { Message = "Product updated successfully", Data = product });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("product/{id}")]
		public async Task<IActionResult> DeleteProduct(int id)
		{
			try
			{
				var result = await _contentManage.DeleteProductAsync(id);

				if (!result)
					return NotFound(new { Message = "Product not found" });

				return Ok(new { Message = "Product deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("product/{id}/toggle-status")]
		public async Task<IActionResult> ToggleProductStatus(int id, [FromBody] bool isActive)
		{
			try
			{
				var result = await _contentManage.ToggleProductStatusAsync(id, isActive);

				if (!result)
					return NotFound(new { Message = "Product not found" });

				return Ok(new { Message = $"Product status changed to {(isActive ? "Active" : "Inactive")}" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Question Endpoints

		[HttpPost("question/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllQuestions([FromBody] QuestionFilterModel? filter = null)
		{
			try
			{
				filter ??= new QuestionFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var questions = await _contentManage.GetAllQuestionsAsync(filter);
				return Ok(questions);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("question/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetQuestionById(int id)
		{
			try
			{
				var question = await _contentManage.GetQuestionByIdAsync(id);

				if (question == null)
					return NotFound(new { Message = "Question not found" });

				return Ok(question);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("question/create")]
		public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var question = await _contentManage.CreateQuestionAsync(model);
				return Ok(new { Message = "Question created successfully", Data = question });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("question/update")]
		public async Task<IActionResult> UpdateQuestion([FromBody] UpdateQuestionModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var question = await _contentManage.UpdateQuestionAsync(model);
				return Ok(new { Message = "Question updated successfully", Data = question });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("question/{id}")]
		public async Task<IActionResult> DeleteQuestion(int id)
		{
			try
			{
				var result = await _contentManage.DeleteQuestionAsync(id);

				if (!result)
					return NotFound(new { Message = "Question not found" });

				return Ok(new { Message = "Question deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("question/{id}/toggle-status")]
		public async Task<IActionResult> ToggleQuestionStatus(int id, [FromBody] bool isActive)
		{
			try
			{
				var result = await _contentManage.ToggleQuestionStatusAsync(id, isActive);

				if (!result)
					return NotFound(new { Message = "Question not found" });

				return Ok(new { Message = $"Question status changed to {(isActive ? "Active" : "Inactive")}" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Innvestore Endpoints

		[HttpPost("innvestore/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllInnvestores([FromBody] InnvestoreFilterModel? filter = null)
		{
			try
			{
				filter ??= new InnvestoreFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var innvestores = await _contentManage.GetAllInnvestoresAsync(filter);
				return Ok(innvestores);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("innvestore/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetInnvestoreById(int id)
		{
			try
			{
				var innvestore = await _contentManage.GetInnvestoreByIdAsync(id);

				if (innvestore == null)
					return NotFound(new { Message = "Innvestore not found" });

				return Ok(innvestore);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("innvestore/create")]
		public async Task<IActionResult> CreateInnvestore([FromBody] CreateInnvestoreModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var innvestore = await _contentManage.CreateInnvestoreAsync(model);
				return Ok(new { Message = "Innvestore created successfully", Data = innvestore });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("innvestore/update")]
		public async Task<IActionResult> UpdateInnvestore([FromBody] UpdateInnvestoreModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var innvestore = await _contentManage.UpdateInnvestoreAsync(model);
				return Ok(new { Message = "Innvestore updated successfully", Data = innvestore });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("innvestore/{id}")]
		public async Task<IActionResult> DeleteInnvestore(int id)
		{
			try
			{
				var result = await _contentManage.DeleteInnvestoreAsync(id);

				if (!result)
					return NotFound(new { Message = "Innvestore not found" });

				return Ok(new { Message = "Innvestore deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Block Endpoints

		[HttpPost("block/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllBlocks([FromBody] BlockFilterModel? filter = null)
		{
			try
			{
				filter ??= new BlockFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var blocks = await _contentManage.GetAllBlocksAsync(filter);
				return Ok(blocks);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("block/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetBlockById(int id)
		{
			try
			{
				var block = await _contentManage.GetBlockByIdAsync(id);

				if (block == null)
					return NotFound(new { Message = "Block not found" });

				return Ok(block);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("block/slug/{slug}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetBlockBySlug(string slug)
		{
			try
			{
				var block = await _contentManage.GetBlockBySlugAsync(slug);

				if (block == null)
					return NotFound(new { Message = "Block not found" });

				return Ok(block);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("block/create")]
		public async Task<IActionResult> CreateBlock([FromBody] CreateBlockModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var block = await _contentManage.CreateBlockAsync(model);
				return Ok(new { Message = "Block created successfully", Data = block });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("block/update")]
		public async Task<IActionResult> UpdateBlock([FromBody] UpdateBlockModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var block = await _contentManage.UpdateBlockAsync(model);
				return Ok(new { Message = "Block updated successfully", Data = block });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("block/{id}")]
		public async Task<IActionResult> DeleteBlock(int id)
		{
			try
			{
				var result = await _contentManage.DeleteBlockAsync(id);

				if (!result)
					return NotFound(new { Message = "Block not found" });

				return Ok(new { Message = "Block deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("block/{id}/toggle-status")]
		public async Task<IActionResult> ToggleBlockStatus(int id, [FromBody] bool isActive)
		{
			try
			{
				var result = await _contentManage.ToggleBlockStatusAsync(id, isActive);

				if (!result)
					return NotFound(new { Message = "Block not found" });

				return Ok(new { Message = $"Block status changed to {(isActive ? "Active" : "Inactive")}" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Section-Block Relationship Endpoints

		[HttpGet("section/{sectionId}/blocks")]
		[AllowAnonymous]
		public async Task<IActionResult> GetBlocksBySectionId(int sectionId)
		{
			try
			{
				var blocks = await _contentManage.GetBlocksBySectionIdAsync(sectionId);
				return Ok(blocks);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("block/{blockId}/sections")]
		[AllowAnonymous]
		public async Task<IActionResult> GetSectionsByBlockId(int blockId)
		{
			try
			{
				var sections = await _contentManage.GetSectionsByBlockIdAsync(blockId);
				return Ok(sections);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("section/assign-blocks")]
		public async Task<IActionResult> AssignBlocksToSection([FromBody] AssignBlocksToSectionModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var result = await _contentManage.AssignBlocksToSectionAsync(model);

				if (!result)
					return NotFound(new { Message = "Section not found or invalid block IDs" });

				return Ok(new { Message = "Blocks assigned to section successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("block/assign-sections")]
		public async Task<IActionResult> AssignSectionToBlock([FromBody] AssignSectionToBlockModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var result = await _contentManage.AssignSectionToBlockAsync(model);

				if (!result)
					return NotFound(new { Message = "Block not found or invalid section IDs" });

				return Ok(new { Message = "Sections assigned to block successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("section/{sectionId}/block/{blockId}")]
		public async Task<IActionResult> RemoveBlockFromSection(int sectionId, int blockId)
		{
			try
			{
				var result = await _contentManage.RemoveBlockFromSectionAsync(sectionId, blockId);

				if (!result)
					return NotFound(new { Message = "Section-Block relationship not found" });

				return Ok(new { Message = "Block removed from section successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("section-block/{sectionBlockId}/order")]
		public async Task<IActionResult> UpdateSectionBlockOrder(int sectionBlockId, [FromBody] int displayOrder)
		{
			try
			{
				var result = await _contentManage.UpdateSectionBlockOrderAsync(sectionBlockId, displayOrder);

				if (!result)
					return NotFound(new { Message = "Section-Block relationship not found" });

				return Ok(new { Message = "Block order updated successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Branch Endpoints

		[HttpPost("branch/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllBranches([FromBody] BranchFilterModel? filter = null)
		{
			try
			{
				filter ??= new BranchFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var branches = await _contentManage.GetAllBranchesAsync(filter);
				return Ok(branches);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("branch/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetBranchById(int id)
		{
			try
			{
				var branch = await _contentManage.GetBranchByIdAsync(id);

				if (branch == null)
					return NotFound(new { Message = "Branch not found" });

				return Ok(branch);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("branch/create")]
		public async Task<IActionResult> CreateBranch([FromBody] CreateBranchModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var branch = await _contentManage.CreateBranchAsync(model);
				return Ok(new { Message = "Branch created successfully", Data = branch });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("branch/update")]
		public async Task<IActionResult> UpdateBranch([FromBody] UpdateBranchModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var branch = await _contentManage.UpdateBranchAsync(model);
				return Ok(new { Message = "Branch updated successfully", Data = branch });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("branch/{id}")]
		public async Task<IActionResult> DeleteBranch(int id)
		{
			try
			{
				var result = await _contentManage.DeleteBranchAsync(id);

				if (!result)
					return NotFound(new { Message = "Branch not found" });

				return Ok(new { Message = "Branch deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region ShareHolder Endpoints

		[HttpPost("shareholder/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllShareHolders([FromBody] ShareHolderFilterModel? filter = null)
		{
			try
			{
				filter ??= new ShareHolderFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var shareHolders = await _contentManage.GetAllShareHoldersAsync(filter);
				return Ok(shareHolders);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("shareholder/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetShareHolderById(int id)
		{
			try
			{
				var shareHolder = await _contentManage.GetShareHolderByIdAsync(id);

				if (shareHolder == null)
					return NotFound(new { Message = "ShareHolder not found" });

				return Ok(shareHolder);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("shareholder/create")]
		public async Task<IActionResult> CreateShareHolder([FromBody] CreateShareHolderModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var shareHolder = await _contentManage.CreateShareHolderAsync(model);
				return Ok(new { Message = "ShareHolder created successfully", Data = shareHolder });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("shareholder/update")]
		public async Task<IActionResult> UpdateShareHolder([FromBody] UpdateShareHolderModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var shareHolder = await _contentManage.UpdateShareHolderAsync(model);
				return Ok(new { Message = "ShareHolder updated successfully", Data = shareHolder });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("shareholder/{id}")]
		public async Task<IActionResult> DeleteShareHolder(int id)
		{
			try
			{
				var result = await _contentManage.DeleteShareHolderAsync(id);

				if (!result)
					return NotFound(new { Message = "ShareHolder not found" });

				return Ok(new { Message = "ShareHolder deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region BoardMember Endpoints

		[HttpPost("boardmember/getall")]
		[AllowAnonymous]
		public async Task<IActionResult> GetAllBoardMembers([FromBody] BoardMemberFilterModel? filter = null)
		{
			try
			{
				filter ??= new BoardMemberFilterModel();

				if (filter.PageNumber < 1 || filter.PageSize < 1)
					return BadRequest(new { Message = "Page number and page size must be greater than 0" });

				var boardMembers = await _contentManage.GetAllBoardMembersAsync(filter);
				return Ok(boardMembers);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("boardmember/{id}")]
		[AllowAnonymous]
		public async Task<IActionResult> GetBoardMemberById(int id)
		{
			try
			{
				var boardMember = await _contentManage.GetBoardMemberByIdAsync(id);

				if (boardMember == null)
					return NotFound(new { Message = "BoardMember not found" });

				return Ok(boardMember);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPost("boardmember/create")]
		public async Task<IActionResult> CreateBoardMember([FromBody] CreateBoardMemberModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var boardMember = await _contentManage.CreateBoardMemberAsync(model);
				return Ok(new { Message = "BoardMember created successfully", Data = boardMember });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpPut("boardmember/update")]
		public async Task<IActionResult> UpdateBoardMember([FromBody] UpdateBoardMemberModel model)
		{
			try
			{
				if (!ModelState.IsValid)
					return BadRequest(ModelState);

				var boardMember = await _contentManage.UpdateBoardMemberAsync(model);
				return Ok(new { Message = "BoardMember updated successfully", Data = boardMember });
			}
			catch (ArgumentException ex)
			{
				return NotFound(new { Message = ex.Message });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpDelete("boardmember/{id}")]
		public async Task<IActionResult> DeleteBoardMember(int id)
		{
			try
			{
				var result = await _contentManage.DeleteBoardMemberAsync(id);

				if (!result)
					return NotFound(new { Message = "BoardMember not found" });

				return Ok(new { Message = "BoardMember deleted successfully" });
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion

		#region Catalog Endpoints

		[HttpGet("catalog/entity-types")]
		public IActionResult GetEntityTypes()
		{
			try
			{
				var entityTypes = Enum.GetValues(typeof(EntityType))
					.Cast<EntityType>()
					.Select(e => new
					{
						Value = (int)e,
						Name = e.ToString()
					})
					.ToList();

				return Ok(entityTypes);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("catalog/ticket-status")]
		public IActionResult GetTicketStatuses()
		{
			try
			{
				var ticketStatuses = Enum.GetValues(typeof(TicketStatus))
					.Cast<TicketStatus>()
					.Select(e => new
					{
						Value = (int)e,
						Name = e.ToString()
					})
					.ToList();

				return Ok(ticketStatuses);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("catalog/ticket-type")]
		public IActionResult GetTicketTypes()
		{
			try
			{
				var ticketTypes = Enum.GetValues(typeof(TicketType))
					.Cast<TicketType>()
					.Select(e => new
					{
						Value = (int)e,
						Name = e.ToString()
					})
					.ToList();

				return Ok(ticketTypes);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		[HttpGet("catalog/media-type")]
		public IActionResult GetMediaTypes()
		{
			try
			{
				var mediaTypes = Enum.GetValues(typeof(MediaType))
					.Cast<MediaType>()
					.Select(e => new
					{
						Value = (int)e,
						Name = e.ToString()
					})
					.ToList();

				return Ok(mediaTypes);
			}
			catch (Exception ex)
			{
				return BadRequest(new { Message = ex.Message });
			}
		}

		#endregion
	}
}
